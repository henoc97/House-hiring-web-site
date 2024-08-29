

/**
 * Creates a secure HTTP-only cookie with a given token and type.
 *
 * @param {object} res - The HTTP response object.
 * @param {string} token - The token to store in the cookie.
 * @param {string} type - The type of token (e.g., 'owner' or 'tenant').
 */
function createSecureCookie(res, token, type) {
    res.cookie(type + 'Token', token, {
        httpOnly: true,          // Prevents access via JavaScript (protects against XSS attacks)
        secure: true,            // Requires HTTPS (ensures cookie is only sent over secure connections)
        sameSite: 'strict',      // Prevents CSRF attacks by restricting cookies to same-site requests
        maxAge: 4 * 24 * 60 * 60 * 1000 // Cookie expires after 4 days
    });
}

/**
 * Reads a cookie value from the request object.
 *
 * @param {object} req - The HTTP request object.
 * @param {string} cookieName - The name of the cookie to read.
 * @returns {string|undefined} - The value of the cookie, or undefined if the cookie does not exist.
 */
function readCookie(req, cookieName) {
    return req.cookies[cookieName];
}

/**
 * Clears a specific cookie from the response object.
 *
 * @param {object} res - The HTTP response object.
 * @param {string} cookieName - The name of the cookie to clear.
 */
function clearCookie(res, cookieName) {
    res.clearCookie(cookieName, {
        httpOnly: true,          // Ensures the cookie is not accessible via JavaScript
        secure: true,            // Ensures the cookie is only sent over secure connections
        sameSite: 'strict'       // Prevents the cookie from being sent in cross-site requests
    });
}

module.exports = { createSecureCookie, readCookie, clearCookie };

