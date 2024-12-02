// Load environment variables
require('dotenv').config();

// Define configuration based on environment variables
const IP = process.env.IP || 'localhost';
const PORT = process.env.PORT || 3000;

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
const ownerResetPwdURL = `https://house-hiring-web-site.onrender.com/${PATHS.OWNER}/${PATHS.RESET_PWD}`;
const ownerRedirectURL = `https://house-hiring-web-site.onrender.com/${PATHS.OWNER}/${PATHS.REDIRECT}`;

// Export URLs
module.exports = {
  ROOT_URL,
  SOCKET_URL,
  ownerResetPwdURL,
  ownerRedirectURL,
};
