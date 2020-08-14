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

router.post('/registerModel',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.registerModel);

// TODO Frontend integration - getModelData endpoint
router.get('/getModelData',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.getModelData);

// TODO Frontend integration - getFullModelData endpoint
router.get('/getFullModelData',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.getFullModelData);

router.post('/approve',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.approve);

// TODO Frontend integration - remove endpoint
router.post('/remove',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.remove);

router.get('/queryAllModelsByOwner',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.queryAllModelsByOwner);

router.get('/queryAllModelsByApprovedUser',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.queryAllModelsByApprovedUser);

// TODO Frontend integration - updateModel endpoint
router.put('/updateModel',
    checkLogin,
    credentials.getOrgCredentials,
    orgController.updateModel);

module.exports = router;
