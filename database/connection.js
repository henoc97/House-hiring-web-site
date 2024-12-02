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
    port: process.env.DB_PORT || 3306, // Utilisez le port par défaut si non spécifié
    waitForConnections: true,
    connectionLimit: 10, // Limite réduite pour éviter les dépassements
    queueLimit: 0,
    connectTimeout: 10000, // Timeout après 10 secondes
  });
};

const pool = createPool();

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('Database Connection Error:', err.message);
  }
}

testConnection();

module.exports = pool;
