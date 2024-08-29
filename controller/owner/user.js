const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const { User } = require("../../model/user");
const mailTest = require("../../functions/emailTest");
const { generateOwnerToken } = require("../../functions/token");
const {sendOTPemail, sendResetPwdOTPemail} = require('../../email/sender');
const {generateOTPCode} = require('../../functions/otp');
const fs = require('fs');
const path = require('path');
const emailOtp = {};
const resetPwdEmailOtp = {};
const {logger} = require('../../src/logger/logRotation');
const { createSecureCookie } = require('../../functions/cookies')

/**
 * Generates an OTP (One-Time Password) and sends it to the provided email address.
 * @param {Object} req - The request object containing email and password.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.getOtp = async (req, res) => {
    const { email, pwd } = req.body;

    if (mailTest(email)) {
        const otp = generateOTPCode(); // Ensure that generateOTPCode() generates a valid OTP
        const pwdhashed = await hashPassword(pwd);
        sendOTPemail(email, pwdhashed, otp);
        emailOtp[email] = otp;
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: 'Request successful' });
    } else {
        logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        res.status(404).json({ message: 'Entrer un email valide' });
    }
};

/**
 * Generates a password reset OTP and sends it to the provided email address if it is associated with an existing account.
 * @param {Object} req - The request object containing email.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.getResetPwdOtp = async (req, res) => {
    const { email } = req.body;

    if (mailTest(email)) {
        const otp = generateOTPCode(); // Ensure that generateOTPCode() generates a valid OTP
        var result;
        try {
            const [rows] = await req.connection.query("CALL owner_by_email(?)", [email]);
            result = rows[0];
        } catch (error) {
            logger.error('Error: ' + error);
            res.status(500).json({ message: 'Internal Server Error', error });
        } finally {
            if (req.connection) {
                req.connection.release();
            }
        }
        if (result.length > 0 && result[0].id) {
            sendResetPwdOTPemail(email, otp);
            resetPwdEmailOtp[email] = otp;
            logger.info(`200 OK: ${req.method} ${req.url}`);
            res.status(200).json({ message: 'OTP sent' });
        } else {
            logger.warn(`404 Not Found: ${req.method} ${req.url}`);
            res.status(404).json({ message: 'Votre email n\'est associé à aucun compte.' });
        }
    } else {
        logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        res.status(404).json({ message: 'Enter a valid email' });
    }
};

module.exports.updatePwdOwner = async (req, res) => {
    const { email, otp, pwd } = req.body;

    // Validation des entrées
    if (!email || !otp || !pwd) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // Vérification de l'OTP
        if (resetPwdEmailOtp[email] !== otp) {
            logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
            return res.status(400).json({ message: 'OTP invalide' });
        }

        // Suppression de l'OTP après vérification
        delete resetPwdEmailOtp[email];

        // Hachage du mot de passe
        const pwdhashed = await hashPassword(pwd);

        // Exécution de la requête SQL
        const query = "CALL reset_pwd_owner(?, ?)";
        const values = [email, pwdhashed];

        try {
            const [result] = await req.connection.query(query, values);
            logger.info(`200 OK: ${req.method} ${req.url}`);
            return res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
        } catch (error) {
            logger.error('Erreur lors de l\'exécution de la requête SQL', error);
            return res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
        }
    } catch (error) {
        logger.error('Erreur lors de la réinitialisation du mot de passe', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        // Libération de la connexion
        if (req.connection) {
            req.connection.release();
        }
    }
};


/**
 * Creates a new user owner after validating the provided OTP.
 * @param {Object} req - The request object containing email, password, and OTP.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.createUserOwner = async (req, res) => {
    const { email, pwd, otp } = req.body;
    
    if (!mailTest(email)) {
        logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        return res.status(404).json({ message: 'Enter a valid email' });
    }

    if (emailOtp[email] !== otp) {
        logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        return res.status(404).json({ message: 'OTP invalide' });
    } else {
        delete emailOtp.email; // Corrected typo here
    }
    
    try {
        const [result] = await req.connection.query("CALL insert_owner(?, ?)", [pwd, email]);
        const objIDSold = result[0][0]; // Object containing ID and balance
        const user = { id: objIDSold.id, email: email };
        const token = generateOwnerToken(user, "4d");
        createSecureCookie(res, token, 'owner');
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({
            sold: objIDSold.sold,
            message: 'Request successful'
        });
    } catch (error) {
        logger.error('Error: ' + error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Authenticates a user owner by verifying their email and password.
 * @param {Object} req - The request object containing email and password.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.userAuth = async (req, res) => {
    const { email, pwd } = req.body;
    
    if (!mailTest(email)) {
        logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        return res.status(404).json({ message: 'Enter a valid email' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_owner(?)", [email]);
        if (rows[0][0].length === 0) {
            logger.warn(`404 Not Found: ${req.method} ${req.url}`);
            return res.status(404).json({ message: 'No user found' });
        }
        
        const pwdhashed = rows[0][0].pwd;
        if (await comparePasswords(pwd, pwdhashed)) {
            const user = User.jsonToNewUser(rows[0][0]);
            const token = generateOwnerToken(user, "4d");
            createSecureCookie(res, token, 'owner');
            logger.info(`200 OK: ${req.method} ${req.url}`);
            res.status(200).json({
                user: user.toJson(),
                message: 'Request successful'
            });
        } else {
            logger.warn(`404 Not Found: ${req.method} ${req.url}`);
            res.status(404).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        logger.error('Error: ' + error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves information about the currently authenticated user owner.
 * @param {Object} req - The request object containing the authenticated user information.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.myOwner = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = "CALL owner_by_id(?)";
        const values = [userId];
        try {
            const [rows] = await req.connection.query(query, values);
            logger.info(`200 OK: ${req.method} ${req.url}`);
            res.status(200).json(rows[0][0]);
        } catch (error) {
            logger.error('Error executing query', error);
            res.status(500).json({ message: 'Server error' });
        }
    } catch (error) {
        logger.error('Error: ' + error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates the owner information.
 * @param {Object} req - The request object containing updated owner information.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.updateOwner = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { lastname, firstname, email, contactmoov, contacttg } = req.body;
        const query = "CALL update_owner(?, ?, ?, ?, ?, ?)";
        const values = [userId, lastname, firstname, email, contactmoov, contacttg];

        try {
            const [result] = await req.connection.query(query, values);
            logger.info(`200 OK: ${req.method} ${req.url}`);
            res.status(200).json({ message: "Request successful" });
        } catch (error) {
            logger.error('Error executing query', error);
            res.status(500).json({ message: 'Server error' });
        }
    } catch (error) {
        logger.error('Error: ' + error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates the 'sold' amount for a user.
 * @param {Object} req - The request object containing the spend amount.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.updateSold = async (req, res) => {
    const { spend } = req.body;
    const userId = req.user.userId;

    try {
        const [rows] = await req.connection.query("CALL update_sold(?, ?)", [userId, spend]);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0].update_sold);
    } catch (error) {
        logger.error('Error updating sold:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Handles image upload, updates the image URL in the database, and deletes the old image if it exists.
 * @param {Object} req - The request object containing the uploaded file.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.uploadImg = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Retrieve the old image URL
        const [rows1] = await req.connection.query('CALL get_old_img_url(?)', [req.user.userId]);
        
        const oldImgUrl = rows1[0] && rows1[0][0] ? rows1[0][0].img_url : null;

        // Remove the old image from the filesystem if it exists
        if (oldImgUrl) {
            const oldImgPath = path.join(__dirname, '..', '..', 'frontend', oldImgUrl);
            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }
        }

        // Save the new image URL to the database
        const imgUrl = `/img/${req.file.filename}`;
        const query = "CALL set_img_url(?, ?)";
        const values = [req.user.userId, imgUrl];
        const [rows] = await req.connection.query(query, values);

        // Respond with the new image URL and filename
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({
            imageUrl: imgUrl, // Publicly accessible path
            filename: req.file.filename
        });

    } catch (error) {
        logger.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading file' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Inserts a new subscription record into the database.
 * @param {Object} req - The request object containing subscription details.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.insertSubscription = async (req, res) => {
    const { email, ref, sumpaid, method } = req.body;
    const query = "CALL insert_subscription(?, ?, ?, ?)";
    const values = [email, ref, sumpaid, method];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (error) {
        logger.error('Error inserting subscription:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
