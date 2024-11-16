const randomstring = require('randomstring');

/**
 * Generates a numeric OTP code of a specified length.
 *
 * @param {number} length - The length of the OTP code to generate.
 * @returns {string} - A numeric OTP code.
 */
const generateOTPCode = (length = 6) => {
  return randomstring.generate({
    length: length,
    charset: 'numeric',
  });
};

module.exports = { generateOTPCode };

// Example usage
// if (require.main === module) {
//     // Only run the example usage if the module is executed directly
//     const otp = generateOTPCode();
//     console.log('Generated OTP:', otp);
// }
