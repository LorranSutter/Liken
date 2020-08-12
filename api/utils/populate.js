const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const async = require('async');
const mongoose = require('mongoose');

const User = require('../models/user');

const InitiateMongoServer = require('../db/connection');
const mongoURI = process.env.MONGODB_URI_DEV;

InitiateMongoServer(mongoURI);

const orgs = [
    {
        login: 'microsoft',
        password: '123456',
        orgCredentials: '{orgNum:1,ledgerUser:microsoft}'
    },
    {
        login: 'apple',
        password: '123456',
        orgCredentials: '{orgNum:2,ledgerUser:apple}'
    }
];

function saveOrg({ login, password, orgCredentials }, cb) {
    const newOrg = new User({
        login,
        password,
        orgCredentials: JSON.stringify(orgCredentials)
    });

    newOrg.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('New org: ' + newOrg.login);
        cb(null, newOrg);
    });
}

function saveOrgs(cb) {
    async.parallel(
        orgs
            .map(org =>
                (cb) => saveOrg(org, cb)
            )
        , cb);
}

function deleteDatabse(cb) {
    console.log('Deleting database');
    mongoose.connection.dropDatabase()
        .then(() => {
            console.log('Database deleted');
            cb();
        });
}

async.series(
    [
        deleteDatabse,
        saveOrgs
    ],
    (err) => {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('Database populated successfully!');
        }
        mongoose.connection.close();
    });