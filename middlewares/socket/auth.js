// middlewares/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');

/**
 * Middleware to verify WebSocket token using cookies.
 *
 * This middleware extracts the token from the WebSocket request cookies, verifies it using JWT,
 * and attaches the decoded user information to the WebSocket object.
 * If the token is missing or invalid, the WebSocket connection is closed with an appropriate status code and message.
 *
 * @param {WebSocket} ws - The WebSocket connection object.
 * @param {Object} request - The HTTP request object that contains the WebSocket URL and headers.
 * @param {Function} callback - The function to be called once the token is successfully verified.
 * @returns {void}
 */
module.exports = (ws, request, callback) => {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const userType = url.searchParams.get('userType'); // Extract user type from URL
  const cookies = cookie.parse(request.headers.cookie || '');
  const token = cookies[`${userType}Token`]; // or 'tenantToken', 'adminToken', etc.

  if (!token) {
    ws.close(4000, 'Token missing');
    return;
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      ws.close(4001, 'Invalid token');
      return;
    }

    // Attach the decoded token data to the WebSocket object
    ws.user = decoded;
    callback(); // Proceed with the WebSocket connection
  });
};
