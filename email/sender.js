const ejs = require('ejs');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');
const {logger} = require('../src/logger/logRotation');

const { ownerRedirectURL, ownerResetPwdURL } = require('../src/endpoint');

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends an OTP email for account activation.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} pwd - The password for the account (if needed).
 * @param {string} codeOTP - The OTP code to be included in the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendOTPemail = async (email, pwd, codeOTP) => {
  try {
    const filePath = path.join(__dirname, 'activation', 'app-activation.ejs');
    const htmlData = await ejs.renderFile(filePath, {
      root: ownerRedirectURL,
      email: email,
      pwd: pwd,
      codeOTP: codeOTP
    });

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: 'Bienvenue chez Extase-Home',
      html: htmlData
    };

    const info = await transporter.sendMail(mailOptions);
     logger.info('Email sent: ' + info.response);
  } catch (error) {
    logger.error('Error occurred while sending OTP email:', error);
  }
};

/**
 * Sends an OTP email for password reset.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} codeOTP - The OTP code to be included in the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendResetPwdOTPemail = async (email, codeOTP) => {
  try {
    const filePath = path.join(__dirname, 'reset-pwd', 'reset-pwd.ejs');
    const htmlData = await ejs.renderFile(filePath, {
      root: ownerResetPwdURL,
      email: email,
      codeOTP: codeOTP
    });

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: htmlData
    };

    const info = await transporter.sendMail(mailOptions);
     logger.info('Email sent: ' + info.response);
  } catch (error) {
    logger.error('Error occurred while sending password reset email:', error);
  }
};

module.exports = { sendOTPemail, sendResetPwdOTPemail };
