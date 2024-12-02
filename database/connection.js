const mysql = require('mysql2/promise');
const { logger } = require('../src/logger/logRotation');

require('dotenv').config();

/**
 * Creates and exports a MySQL connection pool.
 *
 * The pool is configured with the database connection parameters read from
 * environment variables. It manages a pool of connections to the database
 * to improve performance and handle concurrent requests.
 *
 * @returns {mysql.Pool} - The MySQL connection pool.
 */

const createPool = () => {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Use default port if not specified
    waitForConnections: true,
    connectionLimit: 10, // Reduced limit to avoid overflows
    queueLimit: 0,
    connectTimeout: 10000, // Timeout after 10 seconds
  });
};

const pool = createPool();

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.log('Database connected successfully!');
    connection.release();
  } catch (err) {
    logger.error('Database Connection Error:', err.message);
  }
}

testConnection();

module.exports = pool;
