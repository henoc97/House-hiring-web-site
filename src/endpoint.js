// Load environment variables
require('dotenv').config();

// Define configuration based on environment variables
const IP = process.env.IP || 'localhost';
const PORT = process.env.PORT || 3000;

// Construct the root URL
const ROOT_URL = `http://${IP}:${PORT}/`;

// Define specific paths
const PATHS = {
  OWNER: 'owner',
  RESET_PWD: 'owner-reset-pwd',
  REDIRECT: 'owner-redirect'
};

// Construct specific URLs
const ownerRootURL = `${ROOT_URL}${PATHS.OWNER}`;
const ownerResetPwdURL = `${ownerRootURL}/${PATHS.RESET_PWD}`;
const ownerRedirectURL = `${ownerRootURL}/${PATHS.REDIRECT}`;

// Export URLs
module.exports = {
  ROOT_URL,
  ownerResetPwdURL,
  ownerRedirectURL
};
