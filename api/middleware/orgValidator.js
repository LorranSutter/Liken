const validator = require('express-validator');

exports.login = [

    validator
        .body('login')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Login must be specified.')
        .matches(/^[\w\d ]+$/)
        .withMessage('Login has non-alphanumeric characters.')
        .escape(),
    validator
        .body('password')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Password must be specified.')
        .escape()
];