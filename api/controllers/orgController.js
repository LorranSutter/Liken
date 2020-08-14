const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const networkConnection = require('../utils/networkConnection');

exports.index = async (req, res) => {

    const orgs = (await User.find()).map(user => user.login);

    return res.json({ orgs });
};

exports.login = async (req, res) => {

    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(401).json({ message: 'Invalid login/password' });
    }

    const org = await User.findOne({ login });
    if (!org) {
        return res.status(401).json({ message: 'Invalid login' });
    }

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const userJWT = jwt.sign({ login }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });

    return res.json({ userJWT, ledgerId: org.login, orgCredentials: org.orgCredentials });
};

exports.registerModel = async (req, res) => {

    const { modelName, modelDescription, modelObject } = req.body;
    const modelData = JSON.stringify({ modelName, modelDescription, modelObject });

    networkConnection
        .submitTransaction('registerModel', req.orgNum, req.ledgerUser, [modelData])
        .then(result => {
            if (result.length > 0) {
                result = result.toString();
                return res.json({ message: `Model ${result} registered by ${req.ledgerUser}`, ledgerKey: result });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.getModelData = (req, res) => {

    const { modelKey } = req.query;

    networkConnection
        .evaluateTransaction('getModelData', req.orgNum, req.ledgerUser, [modelKey])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ modelData: JSON.parse(result.toString()) });
                }
                return res.json({ modelData: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.getFullModelData = (req, res) => {

    const { modelKey } = req.query;

    networkConnection
        .evaluateTransaction('getFullModelData', req.orgNum, req.ledgerUser, [modelKey])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ modelData: JSON.parse(result.toString()) });
                }
                return res.json({ modelData: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.approve = async (req, res) => {

    const { modelKey, org, terms, conditions, expirationDate } = req.body;
    const detailsData = JSON.stringify({ terms, conditions, expirationDate });

    networkConnection
        .submitTransaction('approve', req.orgNum, req.ledgerUser, [modelKey, org, detailsData])
        .then(result => {
            if (result) {
                if (JSON.parse(result.toString())) {
                    return res.json({ message: `Organization ${org} approved by ${req.ledgerUser}` });
                }
                return res.json({ message: `You are not the owner of the model ${modelKey}` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.remove = async (req, res) => {

    const { modelKey, org } = req.body;

    networkConnection
        .submitTransaction('remove', req.orgNum, req.ledgerUser, [modelKey, org])
        .then(result => {
            if (result) {
                if (JSON.parse(result.toString())) {
                    return res.json({ message: `Organization ${org} has the approval removed by ${req.ledgerUser}` });
                }
                return res.json({ message: `You are not the owner of the model ${modelKey}` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.queryAllModelsByOwner = (req, res) => {

    networkConnection
        .evaluateTransaction('queryAllModelsByOwner', req.orgNum, req.ledgerUser)
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ modelList: JSON.parse(result.toString()) });
                }
                return res.json({ modelList: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.queryAllModelsByApprovedUser = (req, res) => {

    networkConnection
        .evaluateTransaction('queryAllModelsByApprovedUser', req.orgNum, req.ledgerUser)
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ modelList: JSON.parse(result.toString()) });
                }
                return res.json({ modelList: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};

exports.updateModel = (req, res) => {

    const { modelKey, modelName, modelDescription, modelObject } = req.body;
    const modelData = JSON.stringify({ modelName, modelDescription, modelObject });

    networkConnection
        .submitTransaction('updateModel', req.orgNum, req.ledgerUser, [modelKey, modelData])
        .then(result => {
            if (result) {
                if (result.length > 0) {
                    return res.json({ modelList1: JSON.parse(result.toString()) });
                }
                return res.json({ modelList2: result.toString() });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        })
        .catch((err) => {
            return res.status(500).json({ error: `Something went wrong\n ${err}` });
        });
};