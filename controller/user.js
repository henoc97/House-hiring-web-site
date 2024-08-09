const { hashPassword, comparePasswords } = require("../functions/hash_compare_pwd");
const { User } = require("../model/user");
const pool = require('../database/database_connection');
const mailTest = require("../functions/email_test");
const generateToken = require("../functions/token");
const sendOTPemail = require('../email/activation/sender');
const codeOTP = require('../functions/otp');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const email_otp = {};

module.exports.getotp = async (req, res) => {
    const { email, pwd } = req.body;

    if (mailTest(email)) {
        const otp = codeOTP; // Assurez-vous que codeOTP() génère un OTP valide
        sendOTPemail(email, pwd, otp);
        email_otp[email] = otp;
        res.status(200).json({ message: 'OTP envoyé' });
    } else {
        res.status(404).json({ message: 'Entrer un email valide' });
    }
};

module.exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const key = process.env.TOKEN_KEY;
        const decoded = jwt.verify(refreshToken, key);

        const user = { id: decoded.userId, email: decoded.userEmail };
        const newAccessToken = generateToken(user, "15m");
        const newRefreshToken = generateToken(user, "7d");

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

module.exports.createUserOwner = async (req, res) => {
    const { email, pwd, otp } = req.body;
    console.log(email, pwd, otp);
    if (!mailTest(email)) {
        console.log("problem email" + email);
        return res.status(404).json({ message: 'Entrer un email valide' });
    }

    if (email_otp[email] !== otp) {
        console.log("problem otp", email_otp[email], otp);
        return res.status(404).json({ message: 'OTP invalide' });
    }
    console.log(email, pwd, otp);
    try {
        const connection = await pool.getConnection();
        const pwdhashed = await hashPassword(pwd);
        console.log(pwdhashed);
        const [result] = await connection.query("CALL insert_owner(?, ?)", [pwdhashed, email]);
        const objIDSold = result[0][0]; // l' objet qui contient l' ID et le sold.
        console.log(objIDSold);
        connection.release();
        const newAccessToken = generateToken({ id: objIDSold.id, email: email }, "2d");
        const newRefreshToken = generateToken({ id: objIDSold.id, email: email }, "7d");
        console.log(newAccessToken, newRefreshToken);
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            sold : objIDSold.sold,
            message: 'Requête réussie'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports.userauth = async (req, res) => {
    const { email, pwd } = req.body;
    console.log(email, pwd);
    if (!mailTest(email)) {
        return res.status(404).json({ message: 'Entrer un email valide' });
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("CALL show_owner(?)", [email]);
        connection.release();
        console.log('show_owner', rows[0][0].pwd);
        if (rows[0][0].length === 0) {
            console.log('Le probleme se trouve ici');
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        
        const pwdhashed = rows[0][0].pwd;
        console.log("pwd : ", pwd, " hashed : ", pwdhashed);
        if (await comparePasswords(pwd, pwdhashed)) {
            const user = User.jsonToNewUser(rows[0][0]);
            console.log("user : ", user);
            const newAccessToken = generateToken({ id: user.userID, email: user.email }, "2d");
            const newRefreshToken = generateToken({ id: user.userID, email: user.email }, "7d");
            console.log(newAccessToken, newRefreshToken);
            res.status(200).json({
                refreshToken: newRefreshToken,
                accessToken: newAccessToken,
                user: user.toJson()
            });
        } else {
            res.status(404).json({ message: 'Mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports.updateSold = async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const { userId } = decoded;
        const { spend } = req.body;

        const connection = await pool.getConnection();
        const [rows] = await connection.query("CALL update_sold(?, ?)", [userId, spend]);
        connection.release();

        res.status(200).json(rows[0][0].update_sold);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
