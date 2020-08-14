const express = require('express');
const router = express.Router();

const orgController = require('../controllers/orgController');
const { checkLogin } = require('../middleware/auth');
const orgValidator = require('../middleware/orgValidator');
const { validate } = require('../middleware/validate');
const credentials = require('../middleware/credentials');

router.get('/index', orgController.index);

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
router.post('/remove',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.remove);

// TODO Change to check login
router.get('/queryAllModelsByOwner',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.queryAllModelsByOwner);

// TODO Change to check login
router.get('/queryAllModelsByApprovedUser',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.queryAllModelsByApprovedUser);

// TODO Change to check login
router.put('/updateModel',
    // checkLogin,
    credentials.getOrgCredentials,
    orgController.updateModel);

module.exports = router;
