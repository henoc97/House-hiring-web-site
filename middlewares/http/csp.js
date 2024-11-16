const crypto = require('crypto');
const { ROOT_URL, SOCKET_URL } = require('../../src/endpoint');
const { logger } = require('../../src/logger/logRotation');

/**
 * Middleware to generate a nonce and set Content Security Policy (CSP) headers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @description This middleware generates a random nonce (number used once) for each request and sets it in the `res.locals` object.
 * The nonce is then used in the Content Security Policy (CSP) headers to allow inline scripts and styles with the nonce attribute.
 * The CSP policy is stricter in production, allowing only specific sources and enforcing a strict policy, while in development,
 * it allows unsafe inline scripts and styles for easier debugging.
 *
 * The CSP header helps to prevent cross-site scripting (XSS) attacks by restricting the sources of scripts, styles, images, and other resources.
 */
module.exports = (req, res, next) => {
  // Generate a random nonce using crypto
  res.locals.nonce = crypto.randomBytes(16).toString('base64');

  // Define the Content Security Policy (CSP) based on the environment
  const cspPolicy =
    process.env.NODE_ENV === 'production'
      ? `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}' https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'nonce-${res.locals.nonce}' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com; style-src-elem 'self' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' ${ROOT_URL} ${SOCKET_URL}; report-uri /backend-csp-report/csp-violation;`
      : `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' 'nonce-${res.locals.nonce}' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self' ${ROOT_URL} ${SOCKET_URL}; report-uri /backend-csp-report/csp-violation;`;

  try {
    // Set the CSP header with the constructed policy
    res.setHeader('Content-Security-Policy', cspPolicy);
  } catch (error) {
    // Log any error that occurs while setting the header
    logger.error('Error setting CSP header:', error);
  }

  // Proceed to the next middleware function
  next();
};
