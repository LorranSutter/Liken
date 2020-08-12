const User = require('../models/user');

exports.orgCreate = async function (login, password, ledgerUser, orgNum) {
    const newOrg = new User({
        login,
        password,
        ledgerUser,
        orgNum
    });

    newOrg.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('New org: ' + newOrg.login);
    });
};