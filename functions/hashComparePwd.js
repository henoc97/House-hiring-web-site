const bcrypt = require('bcrypt');
const { logger } = require('../src/logger/logRotation');

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 * @throws {Error} - Throws an error if hashing fails.
 */
const hashPassword = async function (password) {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    logger.error('Error while hashing password:', error);
    throw new Error('Error while hashing password.');
  }
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} plainPassword - The plain text password to be compared.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the passwords match, otherwise `false`.
 * @throws {Error} - Throws an error if comparison fails.
 */
async function comparePasswords(plainPassword, hashedPassword) {
  try {
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
  } catch (error) {
    logger.error('Error during password comparison:', error);
    throw new Error('Error during password comparison.');
  }
}

module.exports = { hashPassword, comparePasswords };

// Example usage for development/testing (to be removed or commented out in production)
// (async () => {
//     try {
//         const hashedPwd = await hashPassword('examplePassword');
//         console.log('Hashed Password:', hashedPwd);
//     } catch (error) {
//         logger.error('Error in example usage:', error);
//     }
// })();
