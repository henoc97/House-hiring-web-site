const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const { User } = require("../../model/user");
const mailTest = require("../../functions/emailTest");
const { generateOwnerToken } = require("../../functions/token");
const {sendOTPemail, sendResetPwdOTPemail} = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');
const fs = require('fs');
const path = require('path');
const emailOtp = {};
const resetPwdEmailOtp = {};

module.exports.getOtp = async (req, res) => {
    const { email, pwd } = req.body;

    if (mailTest(email)) {
        const otp = codeOTP; // Assurez-vous que codeOTP() génère un OTP valide
        sendOTPemail(email, pwd, otp);
        emailOtp[email] = otp;
        res.status(200).json({ message: 'OTP envoyé' });
    } else {
        res.status(404).json({ message: 'Entrer un email valide' });
    }
};

module.exports.getResetPwdOtp = async (req, res) => {
    const { email } = req.body;

    if (mailTest(email)) {
        const otp = codeOTP; // Assurez-vous que codeOTP() génère un OTP valide
        var result;
        try {
            const [rows] = await req.connection.query("CALL owner_by_email(?)", [email]);
            console.log(rows);
            result = rows[0];
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        } finally {
            if (req.connection) {
                req.connection.release();
            }
        }
        if (result.length > 0 && result[0].id) {
            sendResetPwdOTPemail(email, otp);
            resetPwdEmailOtp[email] = otp;
            res.status(200).json({ message: 'OTP envoyé' });
        } else {
            res.status(404).json({ message: 'Votre email n\' est lié à aucun compte.' });
        }
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

    if (emailOtp[email] !== otp) {
        console.log("problem otp", emailOtp[email], otp);
        return res.status(404).json({ message: 'OTP invalide' });
    } else {
        delete emailOtp.email
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
    } finally {
        if (req.connection) {
            req.connection.release();
        }
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
    } finally {
        if (req.connection) {
            req.connection.release();
        }
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
    } finally {
        if (req.connection) {
            req.connection.release();
        }
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
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.updatePwdOwner = async (req, res) => {
    try {
        const { email, otp, pwd } = req.body;
        
        if (resetPwdEmailOtp[email] !== otp) {
            console.log("problem otp", resetPwdEmailOtp[email], otp);
            return res.status(404).json({ message: 'OTP invalide' });
        } else {
            delete resetPwdEmailOtp.email
        }
        const query = "CALL reset_pwd_owner(?, ?)";
        const pwdhashed = await hashPassword(pwd);
        const values = [email, pwdhashed];
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
    } finally {
        if (req.connection) {
            req.connection.release();
        }
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
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.uploadImg = async (req, res) => {
    try {
        // Vérifier si un fichier a été téléchargé
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé' });
        }

        // Récupérer l'ancienne URL de l'image
        const [rows1] = await req.connection.query('CALL get_old_img_url(?)', [req.user.userId]);
        console.log('rows1: ' + JSON.stringify(rows1, null, 2));
        
        // Accéder correctement à l'URL de l'image
        const oldImgUrl = rows1[0] && rows1[0][0] ? rows1[0][0].img_url : null;

        // Supprimer l'ancienne image du système de fichiers
        console.log('oldImgUrl111: ' + oldImgUrl);
        if (oldImgUrl) {
            console.log('oldImgUrl: ' + oldImgUrl);
            const oldImgPath = path.join(__dirname, '..', '..', 'frontend', oldImgUrl);
            console.log('YESSSSSSSSSSSSSSSSSSS : ' + oldImgPath);
            if (fs.existsSync(oldImgPath)) {
                console.log('YESSSSSSSSSSSSSSSSSSS')
                fs.unlinkSync(oldImgPath);
            }
        }

        // Enregistrer la nouvelle URL de l'image
        const imgUrl = `/img/${req.file.filename}`;
        const query = "CALL set_img_url(?, ?)";
        const values = [req.user.userId, imgUrl];
        const [rows] = await req.connection.query(query, values);

        // Répondre avec l'URL de l'image et le nom du fichier
        res.status(200).json({
            imageUrl: imgUrl, // Chemin accessible publiquement
            filename: req.file.filename
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'upload du fichier' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
}
