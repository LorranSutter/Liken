const crypt = require('../functions/crypt');

exports.getOrgCredentials = (req, res, next) => {
    let orgCredentials = req.cookies.orgCredentials;
    orgCredentials = crypt.decrypt(orgCredentials);
    orgCredentials = JSON.parse(orgCredentials);

    req.orgNum = orgCredentials.orgNum;
    req.ledgerUser = orgCredentials.ledgerUser;

    next();
};