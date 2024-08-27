const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const mailTest = require("../../functions/emailTest");
const { generateAdminToken } = require("../../functions/token");
const {sendOTPemail, sendResetPwdOTPemail} = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');
const fs = require('fs');
const path = require('path');
const emailOtp = {};
const resetPwdEmailOtp = {};


module.exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const key = process.env.TOKEN_KEY;
        const decoded = jwt.verify(refreshToken, key);

        const user = { id: decoded.userId, email: decoded.userEmail };
        const newAccessToken = generateAdminToken(user, "15m");
        const newRefreshToken = generateAdminToken(user, "7d");

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

module.exports.userAuth = async (req, res) => {
    const { email, pwd } = req.body;
    console.log(email, pwd);
    
    if (!mailTest(email)) {
        return res.status(404).json({ message: 'Entrer un email valide' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_admin(?)", [email]);
        console.log("ici : ", rows);
        console.log(rows[0]);
        // console.log('show_admin', rows[0][0].pwd);
        if (rows[0][0].length === 0) {
            console.log('Le probleme se trouve ici');
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        
        const pwdhashed = rows[0][0].pwd;
        console.log("pwd : ", pwd, " hashed : ", pwdhashed);
        if (await comparePasswords(pwd, pwdhashed)) {
            const user = rows[0][0];
            console.log("user : ", user);
            const newAccessToken = generateAdminToken({ id: user.id, email: user.email }, "2d");
            const newRefreshToken = generateAdminToken({ id: user.id, email: user.email }, "7d");
            console.log(newAccessToken, newRefreshToken);
            res.status(200).json({
                refreshToken: newRefreshToken,
                accessToken: newAccessToken,
            });
        } else {
            res.status(404).json({ message: 'Mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Error : ' + error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
