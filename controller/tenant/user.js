const { hashPassword, comparePasswords } = require("../../functions/hash_compare_pwd");
const { User } = require("../../model/user");
const mailTest = require("../../functions/email_test");
const { generateTenantToken } = require("../../functions/token");
const sendOTPemail = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');

// Tenant Account Activation Controller
module.exports.activateTenantAccount = async (req, res) => {
    const { key, pr_ten } = req.body; 
    try {
        const [result] = await req.connection.query("CALL activate_tenant(?)", [key]);
        const obj = result[0][0];
        if (!obj) {
            throw new Error('No result returned from the procedure.');
        }
        
        const newAccessToken = generateTenantToken({ id: obj.id, pr_ten_id: pr_ten }, "2d");
        const newRefreshToken = generateTenantToken({ id: obj.id, pr_ten_id: pr_ten }, "7d");
        
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            createTime: obj.create_time,
            message: 'Requête réussie'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        req.connection.release();
    }
};

// Password Update Controller
module.exports.setpwd = async (req, res) => {
    try {
        const { pwd } = req.body;
        const pwdhashed = await hashPassword(pwd);
        const query = "CALL set_tenant_pwd( ?, ? )";
        const values = [req.user.userId, pwdhashed];

        try {
            const [result] = await req.connection.query(query, values);
            res.status(200).json({ message: "requête réussie" });
        } catch (queryError) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};
