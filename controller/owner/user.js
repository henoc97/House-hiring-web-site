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
        sendOTPemail(email, pwd, otp);
        emailOtp[email] = otp;
        res.status(200).json({ message: 'OTP sent' });
    } else {
        res.status(404).json({ message: 'Enter a valid email' });
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
            console.log(rows);
            result = rows[0];
        } catch (error) {
            console.error('Error: ' + error);
            res.status(500).json({ message: 'Internal Server Error', error });
        } finally {
            if (req.connection) {
                req.connection.release();
            }
        }
        if (result.length > 0 && result[0].id) {
            sendResetPwdOTPemail(email, otp);
            resetPwdEmailOtp[email] = otp;
            res.status(200).json({ message: 'OTP sent' });
        } else {
            res.status(404).json({ message: 'Your email is not associated with any account.' });
        }
    } else {
        res.status(404).json({ message: 'Enter a valid email' });
    }
};

/**
 * Refreshes the access token using a provided refresh token.
 * @param {Object} req - The request object containing the refresh token.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
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

module.exports.updatePwdOwner = async (req, res) => {
    const { email, otp, pwd } = req.body;

    // Validation des entrées
    if (!email || !otp || !pwd) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // Vérification de l'OTP
        if (resetPwdEmailOtp[email] !== otp) {
            console.log("OTP invalide", resetPwdEmailOtp[email], otp);
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
            console.log(result);
            return res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête SQL', error);
            return res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe', error);
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
    console.log(email, pwd, otp);
    
    if (!mailTest(email)) {
        console.log("Invalid email: " + email);
        return res.status(404).json({ message: 'Enter a valid email' });
    }

    if (emailOtp[email] !== otp) {
        console.log("Invalid OTP", emailOtp[email], otp);
        return res.status(404).json({ message: 'OTP invalide' });
    } else {
        delete emailOtp.email; // Corrected typo here
    }
    
    console.log(email, pwd, otp);
    try {
        const pwdhashed = await hashPassword(pwd);
        console.log(pwdhashed);
        const [result] = await req.connection.query("CALL insert_owner(?, ?)", [pwdhashed, email]);
        const objIDSold = result[0][0]; // Object containing ID and balance
        console.log(objIDSold);
        const newAccessToken = generateOwnerToken({ id: objIDSold.id, email: email }, "2d");
        const newRefreshToken = generateOwnerToken({ id: objIDSold.id, email: email }, "7d");
        console.log(newAccessToken, newRefreshToken);
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            sold: objIDSold.sold,
            message: 'Request successful'
        });
    } catch (error) {
        console.error('Error: ' + error);
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
    console.log(email, pwd);
    
    if (!mailTest(email)) {
        return res.status(404).json({ message: 'Enter a valid email' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_owner(?)", [email]);
        console.log(rows[0]);
        console.log('show_owner', rows[0][0].pwd);
        if (rows[0][0].length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'No user found' });
        }
        
        const pwdhashed = rows[0][0].pwd;
        console.log("Password: ", pwd, " Hashed: ", pwdhashed);
        if (await comparePasswords(pwd, pwdhashed)) {
            const user = User.jsonToNewUser(rows[0][0]);
            console.log("User: ", user);
            const newAccessToken = generateOwnerToken({ id: user.userID, email: user.email }, "2d");
            const newRefreshToken = generateOwnerToken({ id: user.userID, email: user.email }, "7d");
            console.log(newAccessToken, newRefreshToken);
            res.status(200).json({
                refreshToken: newRefreshToken,
                accessToken: newAccessToken,
                user: user.toJson()
            });
        } else {
            res.status(404).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error: ' + error);
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
        console.log("UserId: " + userId);
        try {
            const [rows] = await req.connection.query(query, values);
            console.log(rows[0]);
            console.log("Owner rows: ", rows);
            res.status(200).json(rows[0][0]);
        } catch (error) {
            console.error('Error executing query', error);
            res.status(500).json({ message: 'Server error' });
        }
    } catch (error) {
        console.log('Error executing', error);
        console.error('Error: ' + error);
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
            console.log(result);
            res.status(200).json({ message: "Request successful" });
        } catch (error) {
            console.error('Error executing query', error);
            res.status(500).json({ message: 'Server error' });
        }
    } catch (error) {
        console.error('Error: ' + error);
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
        console.log('Update Sold Result:', rows[0]);
        res.status(200).json(rows[0][0].update_sold);
    } catch (error) {
        console.error('Error updating sold:', error);
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
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Retrieve the old image URL
        const [rows1] = await req.connection.query('CALL get_old_img_url(?)', [req.user.userId]);
        console.log('Old Image URL Result:', JSON.stringify(rows1, null, 2));
        
        const oldImgUrl = rows1[0] && rows1[0][0] ? rows1[0][0].img_url : null;

        // Remove the old image from the filesystem if it exists
        if (oldImgUrl) {
            const oldImgPath = path.join(__dirname, '..', '..', 'frontend', oldImgUrl);
            console.log('Deleting old image at path:', oldImgPath);
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
        res.status(200).json({
            imageUrl: imgUrl, // Publicly accessible path
            filename: req.file.filename
        });

    } catch (error) {
        console.error('Error uploading image:', error);
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
        console.log('Subscription Insert Result:', rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (error) {
        console.error('Error inserting subscription:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
