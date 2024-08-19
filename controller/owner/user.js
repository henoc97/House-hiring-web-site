const { hashPassword, comparePasswords } = require("../../functions/hash_compare_pwd");
const { User } = require("../../model/user");
const mailTest = require("../../functions/email_test");
const { generateOwnerToken } = require("../../functions/token");
const sendOTPemail = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');

const email_otp = {};

module.exports.getOtp = async (req, res) => {
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
        const newAccessToken = generateOwnerToken(user, "15m");
        const newRefreshToken = generateOwnerToken(user, "7d");

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
        const pwdhashed = await hashPassword(pwd);
        console.log(pwdhashed);
        const [result] = await req.connection.query("CALL insert_owner(?, ?)", [pwdhashed, email]);
        const objIDSold = result[0][0]; // l' objet qui contient l' ID et le sold.
        console.log(objIDSold);
        const newAccessToken = generateOwnerToken({ id: objIDSold.id, email: email }, "2d");
        const newRefreshToken = generateOwnerToken({ id: objIDSold.id, email: email }, "7d");
        console.log(newAccessToken, newRefreshToken);
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            sold: objIDSold.sold,
            message: 'Requête réussie'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports.userAuth = async (req, res) => {
    const { email, pwd } = req.body;
    console.log(email, pwd);
    
    if (!mailTest(email)) {
        return res.status(404).json({ message: 'Entrer un email valide' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_owner(?)", [email]);
        console.log(rows[0]);
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
            const newAccessToken = generateOwnerToken({ id: user.userID, email: user.email }, "2d");
            const newRefreshToken = generateOwnerToken({ id: user.userID, email: user.email }, "7d");
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

module.exports.myOwner = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = "CALL owner_by_id(?)";
        const values = [userId];
        console.log("userId: " + userId);
        try {
            const [rows] = await req.connection.query(query, values);
            console.log(rows[0]);
            console.log("rows owner: ", rows);
            res.status(200).json(rows[0][0]);
        } catch (queryError) {
            console.error('Erreur lors de l\'exécution de la requête', queryError);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.updateOwner = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { lastname, firstname, email, contactmoov, contacttg } = req.body;
        const query = "CALL update_owner(?, ?, ?, ?, ?, ?)";
        const values = [userId, lastname, firstname, email, contactmoov, contacttg];

        try {
            const [result] = await req.connection.query(query, values);
            console.log(result);
            res.status(200).json({ message: "requête réussie" });
        } catch (queryError) {
            console.error('Erreur lors de l\'exécution de la requête', queryError);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.updateSold = async (req, res) => {
    const { spend } = req.body;
    const userId = req.user.userId;

    try {
        const [rows] = await req.connection.query("CALL update_sold(?, ?)", [userId, spend]);
        console.log(rows[0]);
        res.status(200).json(rows[0][0].update_sold);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
