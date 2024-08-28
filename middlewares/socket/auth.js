// middlewares/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify WebSocket token.
 * 
 * This middleware extracts the token from the WebSocket request URL, verifies it using JWT, and attaches the decoded user information to the WebSocket object.
 * If the token is missing or invalid, the WebSocket connection is closed with an appropriate status code and message.
 * 
 * @param {WebSocket} ws - The WebSocket connection object.
 * @param {Object} request - The HTTP request object that contains the WebSocket URL and headers.
 * @param {Function} callback - The function to be called once the token is successfully verified.
 * @returns {void}
 */
module.exports = (ws, request, callback) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    
    console.log("Token:", token);

    if (!token) {
        ws.close(4000, 'Token missing');
        console.log('Token missing');
        return;
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            ws.close(4001, 'Invalid token');
            console.log('Invalid token');
            return;
        }

        // Attach the decoded token data to the WebSocket object
        ws.user = decoded;
        callback(); // Proceed with the WebSocket connection
    });
};
