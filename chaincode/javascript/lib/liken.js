const { Contract } = require('fabric-contract-api');

const utils = require('./utils');

const initialModelData = require('../data/initialModelData.json');
const initialLoanData = require('../data/initialLoanData.json');

class Liken extends Contract {

    constructor() {
        super();
        this.nextModelId = 1;
        this.nextLoanId = 1;
    }

    /**
     * @param {Context} ctx
     * @dev initiate ledger storing initial data
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const modelOwnerRelation = {};

        for (const data of initialModelData) {
            const newModelId = 'MODEL' + this.nextModelId;

            await ctx.stub.putState(newModelId, Buffer.from(JSON.stringify(data)));
            console.info('Added <--> ', data);
            this.nextModelId++;

            if (!modelOwnerRelation.hasOwnProperty(data.owner)) {
                modelOwnerRelation[data.owner] = [];
            }
            modelOwnerRelation[data.owner].push(newModelId);
        }

        for (const owner of Object.keys(modelOwnerRelation)) {
            const models = modelOwnerRelation[owner];
            await ctx.stub.putState(owner, Buffer.from(JSON.stringify(models)));
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

        modelData = JSON.parse(modelData);
        const callerId = utils.getCallerId(ctx);

        const model = {
            owner: callerId,
            modelObject: modelData.modelObject,
            modelName: modelData.modelName,
            modelDescription: modelData.modelDescription,
            publicationDate: new Date().toISOString(),
            whoPublishedLast: callerId
        };

        const newId = 'MODEL' + this.nextModelId;
        this.nextModelId++;

        await ctx.stub.putState(newId, Buffer.from(JSON.stringify(model)));

        const modelsListByOwnerAsBytes = await ctx.stub.getState(callerId);
        if (!modelsListByOwnerAsBytes || modelsListByOwnerAsBytes.length === 0) {
            await ctx.stub.putState(callerId, Buffer.from(JSON.stringify([newId])));
        } else {
            const modelsListByOwner = JSON.parse(modelsListByOwnerAsBytes);
            if (!modelsListByOwner.includes(newId)) {
                modelsListByOwner.push(newId);
                await ctx.stub.putState(callerId, Buffer.from(JSON.stringify(modelsListByOwner)));
            }
        }

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
        delete modelData.modelObject;

        return modelData;
    }

    /**
     * @param {Context} ctx
     * @param {string} modelKey
     * @dev returns a full model by its key
     * @returns {object} model data as an object
     */
    async getFullModelData(ctx, modelKey) {

        if (!await utils.isAllowed(ctx, modelKey)) {
            return null;
        }

        const modelAsBytes = await ctx.stub.getState(modelKey);
        if (!modelAsBytes || modelAsBytes.length === 0) {
            return null;
        }

        return JSON.parse(modelAsBytes);
    }

    /**
     * @param {Context} ctx
     * @dev get a list of models stored in the ledger owned by caller
     * @returns {Array} array of models
     */
    async queryAllModelsByOwner(ctx) {
        console.info('====================== START : Querying all models owned by caller ======================');

        const callerId = utils.getCallerId(ctx);
        const modelKeyList = await ctx.stub.getState(callerId);
        if (!modelKeyList || modelKeyList.length === 0) {
            return null;
        }
        const allResults = [];
        for (const modelKey of JSON.parse(modelKeyList)) {
            const model = await ctx.stub.getState(modelKey);
            allResults.push({ key: modelKey, modelData: JSON.parse(model) });
        }

        console.info('====================== END : Querying all models owned by caller ======================');

        return allResults;
    }

    /**
     * @param {Context} ctx
     * @dev get a list of models stored in the ledger approved for caller
     * @returns {Array} array of models
     */
    async queryAllModelsByApprovedUser(ctx) {
        console.info('====================== START : Querying all models approved for caller ======================');

        const modelKeyList = await utils.getModelsByCaller(ctx);
        if (!modelKeyList || modelKeyList.length === 0) {
            return null;
        }
        const allResults = [];
        for (const modelKey of JSON.parse(modelKeyList)) {
            const model = await ctx.stub.getState(modelKey);
            allResults.push({ key: modelKey, modelData: JSON.parse(model) });
        }

        console.info('====================== END : Querying all models approved for caller ======================');

        return allResults;
    }

    /**
     * @param {Context} ctx
     * @param {string} modelKey
     * @param {string} user
     * @param {object} detailsData
     * @dev approve user to access model under terms and conditions
     * @returns {boolean} return true if approved
     */
    async approve(ctx, modelKey, user, detailsData) {
        console.info('======== START : Approve user to access model ==========');

        if (!await utils.isOwner(ctx, modelKey)) {
            return false;
        }

        detailsData = JSON.parse(detailsData);
        if (!utils.isDetailsValid(detailsData)) {
            return false;
        }

        detailsData.modelKey = modelKey;
        detailsData.publicationDate = new Date().toISOString();
        detailsData.expirationDate = new Date(detailsData.expirationDate).toISOString();

        const userModelIndexKey = await ctx.stub.createCompositeKey('user~modelKey', [user, modelKey]);

        if (!userModelIndexKey) {
            throw new Error('Composite key: userModelIndexKey is null');
        }

        await ctx.stub.putState(userModelIndexKey, Buffer.from(JSON.stringify(detailsData)));
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

        if (!await utils.isOwner(ctx, modelKey)) {
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
}

module.exports = Liken;
