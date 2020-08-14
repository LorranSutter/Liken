const crypt = require('../functions/crypt');

exports.getOrgCredentials = (req, res, next) => {
    // TODO change to use cookies
    let orgCredentials = req.cookies.orgCredentials;
    // let orgCredentials = req.query.orgCredentials;
    orgCredentials = crypt.decrypt(orgCredentials);
    orgCredentials = JSON.parse(orgCredentials);

    req.orgNum = orgCredentials.orgNum;
    req.ledgerUser = orgCredentials.ledgerUser;

    next();
};