const ejs = require('ejs'); 
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.EMAIL_PASS 
  }
});

const sendOTPemail = async (email, pwd, codeOTP) => {
  try {
    const htmlData = await ejs.renderFile(__dirname + '/app-activation.ejs', {
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
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};

module.exports = sendOTPemail;