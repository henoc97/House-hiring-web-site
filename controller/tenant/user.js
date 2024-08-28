const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const { generateTenantToken } = require("../../functions/token");

// Tenant Account Activation Controller
/**
 * Activates a tenant account and generates new access and refresh tokens.
 * @param {Object} req - The request object containing the key and prTenId.
 * @param {Object} res - The response object.
 */
module.exports.activateTenantAccount = async (req, res) => {
    const { key, prTenId } = req.body;

    // Validate input
    if (!key || !prTenId) {
        return res.status(400).json({ message: 'Missing key or prTenId' });
    }

    try {
        const [result] = await req.connection.query("CALL activate_tenant(?)", [key]);
        const obj = result[0][0];

        if (!obj) {
            return res.status(404).json({ message: 'No result found for the provided key' });
        }

        const newAccessToken = generateTenantToken({ id: obj.id, prTenId }, "2d");
        const newRefreshToken = generateTenantToken({ id: obj.id, prTenId }, "7d");

        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            createTime: obj.create_time,
            userName: obj.firstname.split(' ')[0].toLowerCase(),
            count: obj.count,
            message: 'Request successful'
        });
    } catch (error) {
        console.error('Error activating tenant account:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

// Password Update Controller
/**
 * Sets a new password for a tenant.
 * @param {Object} req - The request object containing the password and userName.
 * @param {Object} res - The response object.
 */
module.exports.setPwd = async (req, res) => {
    const { pwd, userName } = req.body;

    // Validate input
    if (!pwd || !userName) {
        return res.status(400).json({ message: 'Missing password or userName' });
    }

    try {
        const pwdHashed = await hashPassword(pwd);
        const query = "CALL set_tenant_pwd(?, ?, ?)";
        const values = [req.user.userId, pwdHashed, userName];

        await req.connection.query(query, values);
        res.status(200).json({ message: 'Request successful' });
    } catch (error) {
        console.error('Error setting password:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Authenticates a user and generates tokens if the credentials are valid.
 * @param {Object} req - The request object containing the userName and password.
 * @param {Object} res - The response object.
 */
module.exports.userAuth = async (req, res) => {
    const { userName, pwd } = req.body;

    // Validate input
    if (!userName || !pwd) {
        return res.status(400).json({ message: 'Missing userName or password' });
    }

    try {
        const [rows] = await req.connection.query("CALL show_tenant_by_username(?)", [userName]);

        if (rows[0].length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0][0];
        if (await comparePasswords(pwd, user.pwd)) {
            const newAccessToken = generateTenantToken({ id: user.id, prTenId: user.pr_ten_id }, "2d");
            const newRefreshToken = generateTenantToken({ id: user.id, prTenId: user.pr_ten_id }, "7d");

            res.status(200).json({
                refreshToken: newRefreshToken,
                accessToken: newAccessToken,
                message: 'Request successful'
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error during user authentication:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves tenant details by user ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports.myTenant = async (req, res) => {
    const userId = req.user.userId;

    try {
        const query = "CALL tenant_by_id(?)";
        const values = [userId];
        const [rows] = await req.connection.query(query, values);

        if (rows[0].length === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json(rows[0][0]);
    } catch (error) {
        console.error('Error retrieving tenant details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates tenant information.
 * @param {Object} req - The request object containing tenant details.
 * @param {Object} res - The response object.
 */
module.exports.updateTenant = async (req, res) => {
    const { firstname, lastname, contactmoov, contacttg, date } = req.body;

    // Validate input
    if (!firstname || !lastname || !contactmoov || !contacttg || !date) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const query = "CALL update_tenant(?, ?, ?, ?, ?, ?)";
    const values = [req.user.userId, lastname, firstname, contactmoov, contacttg, date];

    try {
        const [result] = await req.connection.query(query, values);
        res.status(200).json(result[0][0]);
    } catch (error) {
        console.error('Error updating tenant:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates tenant password using a reset code.
 * @param {Object} req - The request object containing the reset code and new password.
 * @param {Object} res - The response object.
 */
module.exports.updatePwdTenant = async (req, res) => {
    const { code, pwd } = req.body;

    // Validate input
    if (!code || !pwd) {
        return res.status(400).json({ message: 'Missing code or password' });
    }

    try {
        const pwdHashed = await hashPassword(pwd);
        const query = "CALL reset_pwd_tenant(?, ?)";
        const values = [code, pwdHashed];

        await req.connection.query(query, values);
        res.status(200).json({ message: 'Request successful' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
