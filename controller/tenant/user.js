const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const { User } = require("../../model/user");
const mailTest = require("../../functions/emailTest");
const { generateTenantToken } = require("../../functions/token");
const sendOTPemail = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');

// Tenant Account Activation Controller
module.exports.activateTenantAccount = async (req, res) => {
    const { key, prTenId } = req.body; 
    try {
        const [result] = await req.connection.query("CALL activate_tenant(?)", [key]);
        const obj = result[0][0];
        if (!obj) {
            throw new Error('No result returned from the procedure.');
        }
        
        const newAccessToken = generateTenantToken({ id: obj.id, prTenId: prTenId }, "2d");
        const newRefreshToken = generateTenantToken({ id: obj.id, prTenId: prTenId }, "7d");
        
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            createTime: obj.create_time,
            message: 'Requête réussie'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
}
};

// Password Update Controller
module.exports.setPwd = async (req, res) => {
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
        if (req.connection) {
            req.connection.release();
        }
}
};

module.exports.myTenant = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = "CALL tenant_by_id(?)";
        const values = [userId];
        console.log("userId: " + userId);
        try {
            const [rows] = await req.connection.query(query, values);
            console.log(rows[0]);
            console.log("rows tenant: ", rows);
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

module.exports.updateTenant = async (req, res) => {
    const { firstname, lastname, contactmoov, contacttg, date } = req.body;
    const query = "CALL update_tenant(?, ?, ?, ?, ?, ?)";
    const values = [req.user.userId, lastname, firstname, contactmoov, contacttg, date];

    try {
        const [result] = await req.connection.query(query, values);
        res.status(200).json(result[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
}
};
