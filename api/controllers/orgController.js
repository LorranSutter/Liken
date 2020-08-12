const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const networkConnection = require('../utils/networkConnection');

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

exports.getModelData = (req, res) => {

    const { modelKey } = req.query;

    // TODO Change to use cookies
    networkConnection
        // .evaluateTransaction('getModelData', req.orgNum, req.ledgerUser, [req.cookies.ledgerId, fields || []])
        .evaluateTransaction('getModelData', req.query.orgNum, req.query.ledgerUser, [modelKey])
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

    // TODO Change to use cookies
    networkConnection
        // .evaluateTransaction('getModelData', req.orgNum, req.ledgerUser, [req.cookies.ledgerId, fields || []])
        .evaluateTransaction('getFullModelData', req.query.orgNum, req.query.ledgerUser, [modelKey])
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