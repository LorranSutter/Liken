const ClientIdentity = require('fabric-shim').ClientIdentity;

/**
 * @private
 * @param {Context} ctx
 * @param {Iterator} relationResultsIterator
 * @dev iterate a composite key iterator
 * @returns {Array} list of results of the iteration
 */
async function getRelationsArray(ctx, relationResultsIterator) {
    let relationsArray = [];
    while (true) {

        const responseRange = await relationResultsIterator.next();

        if (!responseRange || !responseRange.value) {
            return JSON.stringify(relationsArray);
        }

        const { attributes } = await ctx.stub.splitCompositeKey(responseRange.value.key);

        relationsArray.push(attributes[1]);
    }
}

/**
 * @private
 * @param {Context} ctx
 * @dev extracting the CA ID
 * @returns {string} CA ID
 */
exports.getCallerId = (ctx) => {
    const cid = new ClientIdentity(ctx.stub);
    const idString = cid.getID();
    const idParams = idString.toString().split('::');
    return idParams[1].split('CN=')[1];
};

/**
 * @private
 * @param {Context} ctx
 * @param {string} modelKey
 * @dev tell if the caller is the model owner
 * @returns {boolean} is the owner or not, return null if model does not exists or does not have data
 */
exports.isOwner = async (ctx, modelKey) => {
    const modelAsBytes = await ctx.stub.getState(modelKey);
    if (!modelAsBytes || modelAsBytes.length === 0) {
        return null;
    }
    const modelData = JSON.parse(modelAsBytes.toString());
    const callerId = this.getCallerId(ctx);

    return modelData.owner === callerId;
};

/**
 * @private
 * @param {Context} ctx
 * @param {string} modelKey
 * @dev check if caller is owner or allowed to update model
 * @returns {boolean} is allowed or not, return null if model does not exists or does not have data
 */
exports.isAllowed = async (ctx, modelKey) => {
    if (await this.isOwner(ctx, modelKey)) {
        return true;
    }

    const callerId = this.getCallerId(ctx);
    const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('user~modelKey', [callerId]);
    const result = await getRelationsArray(ctx, relationResultsIterator);

    return result.includes(modelKey);
};

/**
 * @private
 * @param {object} conditionsData
 * @dev check if conditions data has the required and valid fields
 * @returns {boolean} is valid or not
 */
exports.isConditionsValid = async (conditionsData) => {

    if (!conditionsData.terms ||
        !conditionsData.conditions ||
        !conditionsData.expirationDate) {
        return false;
    }

    const date = new Date(conditionsData.expirationDate);

    return date instanceof Date && !isNaN(date);
};