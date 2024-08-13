const { hashPassword, comparePasswords } = require("../../functions/hash_compare_pwd");
const { User } = require("../../model/user");
const pool = require('../../database/database_connection');
const mailTest = require("../../functions/email_test");
const { generateTenantToken } = require("../../functions/token");
const sendOTPemail = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');
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
        const newAccessToken = generateTenantToken(user, "15m");
        const newRefreshToken = generateTenantToken(user, "7d");

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
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
            const newAccessToken = generateTenantToken({ id: user.userID, email: user.email }, "2d");
            const newRefreshToken = generateTenantToken({ id: user.userID, email: user.email }, "7d");
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

module.exports.activateTenantAccount = async (req, res) => {
    // Assure-toi que les paramètres sont correctement passés. Pour les requêtes GET, utilisez req.query.
    const { key, pr_ten } = req.body; // Utilise req.query si la requête est en GET
    console.log('Received key:', key);
    console.log('Received property_tenant_id:', pr_ten);
    
    try {
        // Obtenir une connexion depuis le pool
        const connection = await pool.getConnection();
        console.log('Database connection established');
        
        // Appel de la procédure stockée
        const [result] = await connection.query("CALL activate_tenant(?)", [key]);
        console.log('Procedure call result:', result);
        
        // Accéder à l'objet contenant l'ID
        const obj = result[0][0]; 
        if (!obj) {
            throw new Error('No result returned from the procedure.');
        }
        
        console.log('Object:', obj);
        
        // Libérer la connexion
        connection.release();
        
        // Générer les tokens
        const newAccessToken = generateTenantToken({ id: obj.id, pr_ten_id: pr_ten }, "2d");
        const newRefreshToken = generateTenantToken({ id: obj.id, pr_ten_id: pr_ten }, "7d");
        
        console.log('New Access Token:', newAccessToken);
        console.log('New Refresh Token:', newRefreshToken);
        
        // Répondre avec les tokens et un message de succès
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            message: 'Requête réussie'
        });
    } catch (error) {
        // Répondre avec un message d'erreur et les détails
        console.error('Error:', error); // Log l'erreur pour le débogage
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



module.exports.setpwd = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }

            const { pwd } = req.body;
            const pwdhashed = await hashPassword(pwd);
            console.log(pwdhashed);
            const query = "CALL set_tenant_pwd( ?, ? )";
            const values = [tokendata.userId, pwdhashed];

            try {
                const [result] = await pool.query(query, values);
                console.log(result);
                res.status(200).json({ message: "requête réussie" });
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
