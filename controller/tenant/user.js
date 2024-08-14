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

// Message Sending Controller
module.exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const query = "CALL insert_message_tenant(?, ?)";
        const values = [req.user.prTenID, message];

        try {
            const [rows] = await req.connection.query(query, values);
            console.log(rows[0]);
            res.status(200).json({ message: "requête réussie" });
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
}

// Tenant Messages Retrieval Controller
module.exports.myMessages = async (req, res) => {
    try {
        const query = "CALL get_messages_viewed_by_tenant(?)";
        const values = [req.user.userId]; 

        try {
            const [rows] = await req.connection.query(query, values);
            console.log(rows[0]);
            res.status(200).json(rows[0]);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
}

// Message Deletion Controller
module.exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;
        const query = "CALL update_message_viewed_tenant(?)";
        const values = [messageId];

        try {
            const [rows] = await req.connection.query(query, values);
            console.log(rows[0]);
            res.status(200).json({ message: "requête réussie" });
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
}
