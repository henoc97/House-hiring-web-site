const { hashPassword, comparePasswords } = require("../../functions/hashComparePwd");
const { User } = require("../../model/user");
const mailTest = require("../../functions/emailTest");
const { generateTenantToken } = require("../../functions/token");
const sendOTPemail = require('../../email/activation/sender');
const codeOTP = require('../../functions/otp');
const { use } = require("../../src/routers/frontendOwnerRouter");

// Tenant Account Activation Controller
module.exports.activateTenantAccount = async (req, res) => {
    const { key, prTenId } = req.body; 
    console.log(`Received key: ${key}, prTenId: ${prTenId}`);

    try {
        const [result] = await req.connection.query("CALL activate_tenant(?)", [key]);
        console.log('Raw result from procedure: ', result);
        const obj = result[0][0];
        
        if (!obj) {
            throw new Error('No result returned from the procedure.');
        }
        
        const newAccessToken = generateTenantToken({ id: obj.id, prTenId: prTenId }, "2d");
        const newRefreshToken = generateTenantToken({ id: obj.id, prTenId: prTenId }, "7d");
        console.log('Generated Tokens:', newAccessToken, newRefreshToken);
        
        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
            createTime: obj.create_time,
            userName: obj.firstname.split(' ')[0].toLowerCase(),
            count: obj.count,
            message: 'Requête réussie'
        });
    } catch (error) {
        console.error('Error : ' + error);
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
        const { pwd, userName } = req.body;
        const pwdhashed = await hashPassword(pwd);
        console.log("User namr: " + userName + " pwd: " + pwd);
        const query = "CALL set_tenant_pwd( ?, ?, ? )";
        const values = [req.user.userId, pwdhashed, userName];

        try {
            const [result] = await req.connection.query(query, values);
            res.status(200).json({ message: "requête réussie" });
        } catch (error) {
            console.error('Error : ' + error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (error) {
        console.error('Error : ' + error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.userAuth = async (req, res) => {
    const { userName, pwd } = req.body;
    console.log(userName, pwd);
    
    try {
        const [rows] = await req.connection.query("CALL show_tenant_by_username(?)", [userName]);
        console.log(rows[0]);
        console.log('show_owner', rows[0][0].pwd);
        if (rows[0].length === 0) {
            console.log('Le probleme se trouve ici');
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        rows[0].forEach(async row => {
            const pwdhashed = row.pwd;
            console.log("pwd : ", pwd, " hashed : ", pwdhashed);
            if (await comparePasswords(pwd, pwdhashed)) {
                const newAccessToken = generateTenantToken({ id: row.id, prTenId: row.pr_ten_id }, "2d");
                const newRefreshToken = generateTenantToken({ id: row.id, prTenId: row.pr_ten_id }, "7d");
                
                res.status(200).json({
                    refreshToken: newRefreshToken,
                    accessToken: newAccessToken,
                    message: 'Requête réussie'
                });
            } else {
                res.status(404).json({ message: 'Mot de passe incorrect' });
            }
        });
        
    } catch (error) {
        console.error('Error : ' + error);
        res.status(500).json({ message: 'Internal Server Error', error });
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
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête', error);
            console.error('Error : ' + error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        console.error('Error : ' + error);
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
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        console.error('Error : ' + error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.updatePwdTenant = async (req, res) => {
    const { code, pwd } = req.body;
    const query = "CALL reset_pwd_tenant(?, ?)";
    const pwdhashed = await hashPassword(pwd);
    const values = [ code, pwdhashed ];

    try {
        const [result] = await req.connection.query(query, values);
        res.status(200).json({message : 'requête réussie'});
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête', error);
        console.error('Error : ' + error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
