const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const mailTest = require("../../functions/emailTest");
const { generateAdminToken } = require("../../functions/token");

/**
 * Handles the refresh token process by validating and generating new tokens.
 * @param {Object} req - The HTTP request object containing the refresh token in the body.
 * @param {Object} res - The HTTP response object.
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
        const newAccessToken = generateAdminToken(user, "15m");
        const newRefreshToken = generateAdminToken(user, "7d");

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

/**
 * Authenticates the user by verifying their email and password.
 * @param {Object} req - The HTTP request object containing the user's email and password in the body.
 * @param {Object} res - The HTTP response object.
 */
module.exports.userAuth = async (req, res) => {
    const { email, pwd } = req.body;
    console.log(email, pwd);

    if (!mailTest(email)) {
        return res.status(404).json({ message: 'Please enter a valid email' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_admin(?)", [email]);
        console.log("Results: ", rows);
        
        if (rows[0][0].length === 0) {
            console.log('No user found');
            return res.status(404).json({ message: 'No user found' });
        }

        const pwdhashed = rows[0][0].pwd;
        console.log("Password: ", pwd, " Hashed Password: ", pwdhashed);

        if (await comparePasswords(pwd, pwdhashed)) {
            const user = rows[0][0];
            console.log("Authenticated user: ", user);
            const newAccessToken = generateAdminToken({ id: user.id, email: user.email }, "2d");
            const newRefreshToken = generateAdminToken({ id: user.id, email: user.email }, "7d");
            console.log("New tokens: ", newAccessToken, newRefreshToken);

            res.status(200).json({
                refreshToken: newRefreshToken,
                accessToken: newAccessToken,
            });
        } else {
            res.status(404).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
