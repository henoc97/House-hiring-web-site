const { comparePasswords } = require("../../functions/hashComparePwd");
const mailTest = require("../../functions/emailTest");
const { generateAdminToken } = require("../../functions/token");
const {logger} = require('../../src/logger/logRotation');
const { createSecureCookie } = require('../../functions/cookies')

/**
 * Authenticates the user by verifying their email and password.
 * @param {Object} req - The HTTP request object containing the user's email and password in the body.
 * @param {Object} res - The HTTP response object.
 */
module.exports.userAuth = async (req, res) => {
    const { email, pwd } = req.body;

    if (!mailTest(email)) {
        logger.warn(`404 Not Found: ${req.method} ${req.url}`);
        return res.status(404).json({ message: 'Please enter a valid email' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_admin(?)", [email]);
        
        if (rows[0][0].length === 0) {
            logger.warn(`404 Not Found: ${req.method} ${req.url}`);
            return res.status(404).json({ message: 'No user found' });
        }

        const pwdhashed = rows[0][0].pwd;

        if (await comparePasswords(pwd, pwdhashed)) {
            const user = rows[0][0];
            const token = generateAdminToken(user, "4d");
            createSecureCookie(res, token, 'admin');
            res.status(200).json({ message: "Token generated"});
            logger.info(`200 OK: ${req.method} ${req.url}`);
        } else {
            logger.warn(`404 Not Found: ${req.method} ${req.url}`);
            res.status(404).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        logger.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
