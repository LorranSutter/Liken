const express = require('express');
const router = express.Router();

const orgController = require('../controllers/orgController');
// const { checkLogin } = require('../middleware/auth');
const orgValidator = require('../middleware/orgValidator');
const { validate } = require('../middleware/validate');
const credentials = require('../middleware/credentials');

// const financialInsitutionController = require('../controllers/financialInsitutionController');
// const fiValidator = require('../middleware/fiValidator');

router.post('/login',
    orgValidator.login,
    validate,
    orgController.login);

// TODO Change to check login
router.post('/registerModel',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.registerModel);

// TODO Change to check login
router.get('/getModelData',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.getModelData);

// TODO Change to check login\
router.get('/getFullModelData',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.getFullModelData);

// TODO Change to check login\
router.post('/approve',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.approve);

// TODO Change to check login\
// TODO Change to check credentials
router.post('/remove',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.remove);

// router.get('/getApprovedFis',
//     checkLogin,
//     credentials.getWhoRegistered,
//     clientController.getApprovedFis);

// router.post('/createClient',
//     fiValidator.registration,
//     validate,
//     credentials.getOrgCredentials,
//     financialInsitutionController.createClient);

// router.post('/login',
//     fiValidator.login,
//     validate,
//     financialInsitutionController.login);

// router.get('/getFiData',
//     checkLogin,
//     credentials.getOrgCredentials,
//     financialInsitutionController.getFiData);

// router.get('/getClientData',
//     checkLogin,
//     credentials.getOrgCredentials,
//     financialInsitutionController.getClientData);

// router.get('/getApprovedClients',
//     checkLogin,
//     credentials.getOrgCredentials,
//     financialInsitutionController.getApprovedClients);

module.exports = router;
