// Load environment variables
require('dotenv').config();

// Define configuration based on environment variables
const IP = process.env.IP || 'localhost';
const PORT = process.env.PORT || 8443;

// Construct the root URL
const ROOT_URL = `https://${IP}:${PORT}`;
const SOCKET_URL = `wss://${IP}:${PORT}`;

// Define specific paths
const PATHS = {
  OWNER: 'owner',
  RESET_PWD: 'reset-pwd',
  REDIRECT: 'redirect',
};

// Construct specific URLs
const ownerRootURL = `${ROOT_URL}/${PATHS.OWNER}`;
const ownerResetPwdURL = `${ownerRootURL}/${PATHS.RESET_PWD}`;
const ownerRedirectURL = `${ownerRootURL}/${PATHS.REDIRECT}`;

// Export URLs
module.exports = {
  ROOT_URL,
  SOCKET_URL,
  ownerResetPwdURL,
  ownerRedirectURL,
};
