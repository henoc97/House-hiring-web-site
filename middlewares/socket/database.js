// middlewares/database.js

const pool = require('../../database/connection');
const { logger } = require('../../src/logger/logRotation');

/**
 * Middleware to establish a database connection for WebSocket requests.
 *
 * This middleware acquires a connection from the MySQL connection pool and attaches it to the WebSocket object.
 * If there is an error in acquiring the connection, the WebSocket connection is closed with an appropriate status code and message.
 *
 * @param {WebSocket} ws - The WebSocket connection object to which the database connection will be attached.
 * @param {Function} callback - The function to be called once the database connection is successfully acquired.
 * @returns {void}
 */
module.exports = async (ws, callback) => {
  try {
    // Acquire a connection from the pool
    ws.connection = await pool.getConnection();
    logger.info('Connected to MySQL');

    // Proceed to the next step
    await callback();
  } catch (err) {
    // Log and close the WebSocket connection on error
    logger.error('Error acquiring database connection:', err);
    ws.close(4002, 'Database connection error');
  }
};
