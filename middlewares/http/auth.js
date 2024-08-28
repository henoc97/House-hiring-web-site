// middlewares/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to authenticate requests using JWT tokens.
 * 
 * @param {Object} req - The request object, which contains the headers and other data.
 * @param {Object} res - The response object, used to send responses back to the client.
 * @param {Function} next - The next middleware function to be executed.
 * @returns {void}
 * @throws {Object} - Responds with a 401 status if no token is provided, or a 403 status if the token is invalid.
 */
module.exports = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(403).json({ message: 'Token not valid' });
        }

        req.user = decoded; // Attach the decoded token data to the request object
        next(); // Proceed to the next middleware or route handler
    });
};
