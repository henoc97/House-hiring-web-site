const pool = require('../database/database_connection');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports.createTenant = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }

            const { id, lastname, firstname, contactmoov, contacttg } = req.body;
            const query = "CALL insert_tenant(?, ?, ?, ?, ?, ?)";
            const values = [id, tokendata.userId, lastname, firstname, contactmoov, contacttg];

            try {
                const [result] = await pool.query(query, values);
                console.log(result);
                res.status(200).json({ message: "requête réussie" });
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.TenantsProperties = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }

            const query = "CALL tenant_properties_by_owner(?)";
            const values = [tokendata.userId];

            try {
                const [rows] = await pool.query(query, values);
                console.log(rows);
                res.status(200).json(rows[0]);
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.recentTenants = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }

            const query = "CALL recent_tenants(?)";
            const values = [tokendata.userId];

            try {
                const [rows] = await pool.query(query, values);
                console.log(rows);
                res.status(200).json(rows[0]);
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.allTenants = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }

            const query = "CALL alltenants(?)";
            const values = [tokendata.userId];
            console.log("tokendata: " + tokendata.userId);
            try {
                const [rows] = await pool.query(query, values);
                console.log("rows tenant: ",  rows);
                res.status(200).json(rows[0]);
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.myTenant = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }
            const { id } = req.body;
            const query = "CALL tenant_by_id(?)";
            const values = [id];
            console.log("tokendata: " + tokendata.userId);
            try {
                const [rows] = await pool.query(query, values);
                console.log("rows tenant: ",  rows);
                res.status(200).json(rows[0][0]);
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


module.exports.updateTenant = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, tokendata) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid' });
            }

            const { id, firstname, lastname, contactmoov, contacttg, date } = req.body;
            const query = "CALL update_tenant(?, ?, ?, ?, ?, ?)";
            const values = [id, lastname, firstname, contactmoov, contacttg, date];

            try {
                const [result] = await pool.query(query, values);
                console.log(result);
                res.status(200).json({ message: "requête réussie" });
            } catch (queryError) {
                console.error('Erreur lors de l\'exécution de la requête', queryError);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
