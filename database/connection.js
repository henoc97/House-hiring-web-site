const mysql = require('mysql2/promise');
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
    waitForConnections: true, // Wait for a connection to become available
    connectionLimit: 35, // Maximum number of connections to create
    queueLimit: 0, // Number of connection requests that can be queued
  });
};

// Create and export the pool
const pool = createPool();

module.exports = pool;
