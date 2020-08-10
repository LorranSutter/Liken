const { Contract } = require('fabric-contract-api');
// const ClientIdentity = require('fabric-shim').ClientIdentity;

const utils = require('./utils');

const initialModelData = require('../data/initialModelData.json');
const initialLoanData = require('../data/initialLoanData.json');

class Liken extends Contract {

    constructor() {
        super();
        this.nextClientId = 1;
        this.nextFiId = 1;
        this.nextModelId = 1;
        this.nextLoanId = 1;
    }

    /**
     * @param {Context} ctx
     * @dev initiate ledger storing initial data
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        // const clients = initialClientData;
        // const fis = initialFIData;

        for (const data of initialModelData) {
            const newModelId = 'MODEL' + this.nextModelId;
            // const whoRegistered = client.whoRegistered.ledgerUser;

            await ctx.stub.putState(newModelId, Buffer.from(JSON.stringify(data)));
            console.info('Added <--> ', data);
            this.nextModelId++;

            // Include who registered the client in the list of FI approved
            // const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [newClientId, whoRegistered]);
            // const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [whoRegistered, newClientId]);
            // await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
            // await ctx.stub.putState(fiClientIndexKey, Buffer.from('\u0000'));
        }

        let newModel = initialModelData[0];
        newModel.model = 'new model';
        newModel.publicationDate = 'afnsdfds';
        await ctx.stub.putState('MODEL1', Buffer.from(JSON.stringify(newModel)));

        for (const data of initialLoanData) {
            const newLoanId = 'LOAN' + this.nextLoanId;
            // const whoRegistered = client.whoRegistered.ledgerUser;

            await ctx.stub.putState(newLoanId, Buffer.from(JSON.stringify(data)));
            console.info('Added <--> ', data);
            this.nextLoanId++;
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    // /**
    //  * @private
    //  * @param {Context} ctx
    //  * @dev extracting the CA ID
    //  * @returns {string} CA ID
    //  */
    // getCallerId(ctx) {
    //     const cid = new ClientIdentity(ctx.stub);
    //     const idString = cid.getID();
    //     const idParams = idString.toString().split('::');
    //     return idParams[1].split('CN=')[1];
    // }

    // /**
    //  * @private
    //  * @param {Context} ctx
    //  * @param {string} modelKey
    //  * @dev tell if the caller is the model owner
    //  * @returns {boolean} is the owner or not, return null if model does not exists or does not have data
    //  */
    // async isOwner(ctx, modelKey) {
    //     const modelAsBytes = await ctx.stub.getState(modelKey);
    //     if (!modelAsBytes || modelAsBytes.length === 0) {
    //         return null;
    //     }
    //     const modelData = JSON.parse(modelAsBytes.toString());
    //     const callerId = this.getCallerId(ctx);

    //     return modelData.owner === callerId;
    // }

    /**
     * @param {Context} ctx
     * @param {object} modelData model object to be registered
     * @dev register a new model
     * @returns {string} new model ID
     */
    async registerModel(ctx, modelData) {
        console.info('============= START : Register model ===========');

        // modelData = JSON.parse(modelData);
        const callerId = utils.getCallerId(ctx);

        // if (modelData.whoRegistered.ledgerUser !== callerId) {
        //     return null;
        // }

        const model = {
            owner: callerId,
            model: modelData,
            publicationDate: new Date().toISOString(),
            datasetIDs: [],
            whoPublishedLast: callerId
        };

        const newId = 'MODEL' + this.nextModelId;
        this.nextModelId++;

        await ctx.stub.putState(newId, Buffer.from(JSON.stringify(model)));

        // Include who registered the client in the list of FI approved
        // const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [newId, callerId]);
        // const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [callerId, newId]);
        // await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
        // await ctx.stub.putState(fiClientIndexKey, Buffer.from('\u0000'));

        console.info('============= END : Register model ===========');

        return newId;
    }

    /**
     * @param {Context} ctx
     * @param {string} modelKey
     * @dev returns a model by its key
     * @returns {object} model data as an object
     */
    async getModelData(ctx, modelKey) {

        const modelAsBytes = await ctx.stub.getState(modelKey);
        if (!modelAsBytes || modelAsBytes.length === 0) {
            return null;
        }

        return modelAsBytes;
    }

    /**
     * @param {Context} ctx
     * @param {string} modelKey
     * @param {string} user
     * @dev approve user to update model
     * @returns {boolean} return true if approved
     */
    async approve(ctx, modelKey, user) {
        console.info('======== START : Approve user to update model ==========');

        const res = await utils.isOwner(ctx, modelKey);

        if (!res) {
            return false;
        }

        // const clientFiIndexKey = await ctx.stub.createCompositeKey('modelKey~user', [modelKey, user]);
        const userModelIndexKey = await ctx.stub.createCompositeKey('user~modelKey', [user, modelKey]);

        // if (!clientFiIndexKey) {
        //     throw new Error('Composite key: clientFiIndexKey is null');
        // }

        if (!userModelIndexKey) {
            throw new Error('Composite key: userModelIndexKey is null');
        }

        // await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
        await ctx.stub.putState(userModelIndexKey, Buffer.from('\u0000'));
        console.info('======== END : Approve user to update model =========');

        return true;
    }

    /**
     * @param {Context} ctx
     * @param {string} modelKey
     * @param {object} modelData
     * @dev update model
     * @returns {boolean} return true if updated
     */
    async updateModel(ctx, modelKey, modelData) {
        console.info('======== START : Update model ==========');

        const res = await utils.isAllowed(ctx, modelKey);

        if (!res) {
            return false;
        }

        const callerId = this.getCallerId(ctx);
        const modelAsBytes = await ctx.stub.getState(modelKey);
        let model = JSON.parse(modelAsBytes.toString());

        model.model = modelData;
        model.publicationDate = new Date().toISOString();
        model.whoPublishedLast = callerId;

        await ctx.stub.putState(modelKey, Buffer.from(JSON.stringify(model)));

        console.info('======== END : Update model =========');

        return true;
    }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @param {object} clientData
    //  * @dev create a new client
    //  * @returns {string} new client ID
    //  */
    // async createClient(ctx, clientData) {
    //     console.info('============= START : Create client ===========');

    //     clientData = JSON.parse(clientData);
    //     const callerId = this.getCallerId(ctx);

    //     if (clientData.whoRegistered.ledgerUser !== callerId) {
    //         return null;
    //     }

    //     const client = {
    //         docType: 'client',
    //         ...clientData
    //     };

    //     const newId = 'CLIENT' + this.nextClientId;
    //     this.nextClientId++;

    //     await ctx.stub.putState(newId, Buffer.from(JSON.stringify(client)));

    //     // Include who registered the client in the list of FI approved
    //     const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [newId, callerId]);
    //     const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [callerId, newId]);
    //     await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
    //     await ctx.stub.putState(fiClientIndexKey, Buffer.from('\u0000'));

    //     console.info('============= END : Create client ===========');

    //     return newId;
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @param {string} clientId
    //  * @param {Array} fields
    //  * @dev get specified fields of client data when called by an FI
    //  * @returns {object} client data as an object
    //  */
    // async getClientData(ctx, clientId, fields) {

    //     const clientAsBytes = await ctx.stub.getState(clientId);
    //     if (!clientAsBytes || clientAsBytes.length === 0) {
    //         return null;
    //     }

    //     const clientData = JSON.parse(clientAsBytes.toString());
    //     const callerId = this.getCallerId(ctx);

    //     // Check caller is who registered
    //     if (clientData.whoRegistered.ledgerUser !== callerId) {

    //         // If caller is not who registered, check if caller is approved
    //         const relations = await this.getRelationByFi(ctx, callerId);
    //         if (!relations.includes(clientId)) {
    //             return null;
    //         }
    //     }

    //     // Get only requested fields
    //     fields = fields.split(',').map(field => field.trim());

    //     let result = {};
    //     for (const field of fields) {
    //         if (clientData.hasOwnProperty(field)) {
    //             result[field] = clientData[field];
    //         }
    //     }
    //     return result;
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @dev get financial insitution data
    //  * @returns {object} FI data as an object
    //  */
    // async getFinancialInstitutionData(ctx) {

    //     const callerId = this.getCallerId(ctx);

    //     const fiAsBytes = await ctx.stub.getState(callerId);
    //     if (!fiAsBytes || fiAsBytes.length === 0) {
    //         return null;
    //     }

    //     return fiAsBytes.toString();
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @param {string} clientId
    //  * @param {string} fiId
    //  * @dev approve FI to access client data
    //  * @returns {boolean} return true if approved
    //  */
    // async approve(ctx, clientId, fiId) {
    //     console.info('======== START : Approve financial institution for client data access ==========');

    //     const res = await this.isWhoRegistered(ctx, clientId);

    //     if (!res) {
    //         return false;
    //     }

    //     const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [clientId, fiId]);
    //     const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [fiId, clientId]);

    //     if (!clientFiIndexKey) {
    //         throw new Error('Composite key: clientFiIndexKey is null');
    //     }

    //     if (!fiClientIndexKey) {
    //         throw new Error('Composite key: fiClientIndexKey is null');
    //     }

    //     await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
    //     await ctx.stub.putState(fiClientIndexKey, Buffer.from('\u0000'));
    //     console.info('======== END : Approve financial institution for client data access =========');

    //     return true;
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @param {string} clientId
    //  * @param {Array} fields
    //  * @dev remove FI access data approval
    //  * @returns {boolean} return true if removed
    //  */
    // async remove(ctx, clientId, fiId) {
    //     console.info('======== START : Remove financial institution for client data access ==========');

    //     if (!this.isWhoRegistered(ctx, clientId)) {
    //         return false;
    //     }

    //     const clientFiIterator = await ctx.stub.getStateByPartialCompositeKey('clientId~fiId', [clientId, fiId]);
    //     const clientFiResult = await clientFiIterator.next();
    //     if (clientFiResult.value) {
    //         await ctx.stub.deleteState(clientFiResult.value.key);
    //     }

    //     const fiClientIterator = await ctx.stub.getStateByPartialCompositeKey('fiId~clientId', [fiId, clientId]);
    //     const fiClientResult = await fiClientIterator.next();
    //     if (fiClientResult.value) {
    //         await ctx.stub.deleteState(fiClientResult.value.key);
    //     }

    //     console.info('======== END : Remove financial institution for client data access =========');

    //     return true;
    // }

    // /**
    //  *
    //  * @private
    //  * @param {Context} ctx
    //  * @param {Iterator} relationResultsIterator
    //  * @dev iterate a composite key iterator
    //  * @returns {Array} list of results of the iteration
    //  */
    // async getRelationsArray(ctx, relationResultsIterator) {
    //     let relationsArray = [];
    //     while (true) {

    //         const responseRange = await relationResultsIterator.next();

    //         if (!responseRange || !responseRange.value) {
    //             return JSON.stringify(relationsArray);
    //         }

    //         const { attributes } = await ctx.stub.splitCompositeKey(responseRange.value.key);

    //         relationsArray.push(attributes[1]);
    //     }
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @param {string} clientId
    //  * @dev get a list of approved FIs
    //  * @returns {Array} list of approved FIs
    //  */
    // async getRelationByClient(ctx, clientId) {
    //     if (!this.isWhoRegistered(ctx, clientId)) {
    //         return null;
    //     }

    //     const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('clientId~fiId', [clientId]);
    //     const result = await this.getRelationsArray(ctx, relationResultsIterator);

    //     return result;
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @dev get a list of clients who approved the caller FI
    //  * @returns {Array} list of clients who approved FI
    //  */
    // async getRelationByFi(ctx) {
    //     const callerID = this.getCallerId(ctx);

    //     const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('fiId~clientId', [callerID]);
    //     const result = await this.getRelationsArray(ctx, relationResultsIterator);

    //     return result;
    // }

    // /**
    //  *
    //  * @param {Context} ctx
    //  * @dev get a list of all data stored in the ledger
    //  * @returns {Array} array of data of the ledger
    //  */
    // async queryAllData(ctx) {
    //     const startKey = '';
    //     const endKey = '';
    //     const allResults = [];
    //     for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
    //         const strValue = Buffer.from(value).toString('utf8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.info(err);
    //             record = strValue;
    //         }
    //         allResults.push({ Key: key, Record: record });
    //     }
    //     console.info(allResults);
    //     return JSON.stringify(allResults);
    // }
}

module.exports = Liken;
