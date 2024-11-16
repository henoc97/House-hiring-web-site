// middlewares/database.js
const pool = require('../../database/connection');
const { logger } = require('../../src/logger/logRotation');

/**
 * Middleware to attach a database connection to the request object.
 *
 * This middleware acquires a connection from the MySQL connection pool and attaches it to the request object.
 * If the connection is successful, it logs the connection status and proceeds to the next middleware or route handler.
 * If an error occurs while acquiring the connection, it logs the error and responds with a 500 status code.
 *
 * @param {Object} req - The request object, which will have a `connection` property attached.
 * @param {Object} res - The response object, used to send responses back to the client.
 * @param {Function} next - The next middleware function to be executed.
 * @returns {void}
 * @throws {Object} - Responds with a 500 status if there is an error acquiring the connection.
 */
module.exports = async (req, res, next) => {
  try {
    req.connection = await pool.getConnection();
    logger.info('Connected to MySQL');
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    logger.error('Error acquiring connection from pool:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
