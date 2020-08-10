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

        for (const data of initialLoanData) {
            const userModelIndexKey = await ctx.stub.createCompositeKey('user~modelKey', [data.user, data.modelKey]);

            if (!userModelIndexKey) {
                throw new Error('Composite key: userModelIndexKey is null');
            }

            await ctx.stub.putState(userModelIndexKey, Buffer.from(JSON.stringify(data)));
            console.info('Added <--> ', data);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

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
     * @dev returns only public data model by its key
     * @returns {object} model data as an object
     */
    async getModelData(ctx, modelKey) {
        const modelAsBytes = await ctx.stub.getState(modelKey);
        if (!modelAsBytes || modelAsBytes.length === 0) {
            return null;
        }

        const modelData = JSON.parse(modelAsBytes);

        // Returns only public information
        delete modelData.model;

        return modelData;
    }

    /**
     * @param {Context} ctx
     * @param {string} modelKey
     * @dev returns a full model by its key
     * @returns {object} model data as an object
     */
    async getFullModelData(ctx, modelKey) {

        const res = utils.isAllowed(ctx, modelKey);
        if (!res) {
            return null;
        }

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
     * @param {object} conditionsData
     * @dev approve user to access model under terms and conditions
     * @returns {boolean} return true if approved
     */
    async approve(ctx, modelKey, user, conditionsData) {
        console.info('======== START : Approve user to access model ==========');

        if (!await utils.isOwner(ctx, modelKey)) {
            return false;
        }

        conditionsData = JSON.parse(conditionsData);
        if (!utils.isConditionsValid(conditionsData)) {
            return false;
        }

        conditionsData.modelKey = modelKey;
        conditionsData.expirationDate = new Date(conditionsData.expirationDate).toISOString();

        // await ctx.stub.putState('LOAN' + this.nextLoanId, Buffer.from(JSON.stringify(conditionsData)));
        // this.nextLoanId++;

        // const clientFiIndexKey = await ctx.stub.createCompositeKey('modelKey~user', [modelKey, user]);
        const userModelIndexKey = await ctx.stub.createCompositeKey('user~modelKey', [user, modelKey]);

        // if (!clientFiIndexKey) {
        //     throw new Error('Composite key: clientFiIndexKey is null');
        // }

        if (!userModelIndexKey) {
            throw new Error('Composite key: userModelIndexKey is null');
        }

        // await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
        // await ctx.stub.putState(userModelIndexKey, Buffer.from('\u0000'));
        await ctx.stub.putState(userModelIndexKey, Buffer.from(JSON.stringify(conditionsData)));
        console.info('======== END : Approve user to access model =========');

        return true;
    }

    /**
     *
     * @param {Context} ctx
     * @param {string} modelKey
     * @param {string} user
     * @dev remove user access model approval
     * @returns {boolean} return true if removed
     */
    async remove(ctx, modelKey, user) {
        console.info('======== START : Remove user for model data access ==========');

        if (!utils.isOwner(ctx, modelKey)) {
            return false;
        }

        const userModelIterator = await ctx.stub.getStateByPartialCompositeKey('user~modelKey', [user, modelKey]);
        const userModelResult = await userModelIterator.next();
        if (userModelResult.value) {
            await ctx.stub.deleteState(userModelResult.value.key);
        }

        console.info('======== END : Remove user for model data access =========');

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

        const callerId = utils.getCallerId(ctx);
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
