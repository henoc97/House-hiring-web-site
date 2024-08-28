

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Secret key used for signing JWTs.
 * @constant {string}
 */
const SECRET_KEY = process.env.TOKEN_KEY;

/**
 * Generates a JWT token for an owner.
 * 
 * @param {Object} user - The user object containing id and email.
 * @param {string} time - The expiration time of the token (e.g., '1h', '2d').
 * @returns {string} - The generated JWT token.
 * @throws {Error} - Throws an error if the token generation fails.
 */
function generateOwnerToken(user, time) {
    const payload = {
        userId: user.id,
        userEmail: user.email,
    };

    const options = {
        expiresIn: time
    };

    try {
        const token = jwt.sign(payload, SECRET_KEY, options);
        return token;
    } catch (error) {
        console.error('Error generating owner token:', error);
        throw new Error('Failed to generate owner token.');
    }
}

/**
 * Generates a JWT token for a tenant.
 * 
 * @param {Object} user - The user object containing id and prTenId.
 * @param {string} time - The expiration time of the token (e.g., '1h', '2d').
 * @returns {string} - The generated JWT token.
 * @throws {Error} - Throws an error if the token generation fails.
 */
function generateTenantToken(user, time) {
    const payload = {
        userId: user.id,
        prTenId: user.prTenId
    };

    const options = {
        expiresIn: time
    };

    try {
        const token = jwt.sign(payload, SECRET_KEY, options);
        return token;
    } catch (error) {
        console.error('Error generating tenant token:', error);
        throw new Error('Failed to generate tenant token.');
    }
}

/**
 * Generates a JWT token for an admin.
 * 
 * @param {Object} user - The user object containing id and email.
 * @param {string} time - The expiration time of the token (e.g., '1h', '2d').
 * @returns {string} - The generated JWT token.
 * @throws {Error} - Throws an error if the token generation fails.
 */
function generateAdminToken(user, time) {
    const payload = {
        adminId: user.id,
        userEmail: user.email
    };

    const options = {
        expiresIn: time
    };

    try {
        const token = jwt.sign(payload, SECRET_KEY, options);
        return token;
    } catch (error) {
        console.error('Error generating admin token:', error);
        throw new Error('Failed to generate admin token.');
    }
}

module.exports = { generateOwnerToken, generateTenantToken, generateAdminToken };
