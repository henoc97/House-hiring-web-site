
const ip = "localhost";

const port = "3000";

const root = 'http://' + ip + ':' + port + '/';

const ownerRoot = root + "owner";

const ownerResetPwdURL = ownerRoot + "/owner-reset-pwd";

const ownerRedirectURL = ownerRoot + "/owner-redirect";


module.exports = {root, ownerResetPwdURL, ownerRedirectURL}