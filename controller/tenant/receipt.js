const pool = require("../../database/database_connection");
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.require_receipt = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const { sumpayed, monthpayed } = req.body;
                console.log(req.body);
                console.log(_tokendata.prTenID, sumpayed, monthpayed);
                const query = "CALL insert_payment(?, ?, ?)";
                const values = [_tokendata.prTenID, sumpayed, monthpayed];

                try {
                    const [rows] = await pool.query(query, values);
                    console.log(rows);
                    res.status(200).json({ message: "requête réussie", data: rows[0][0]});
                } catch (err) {
                    console.error('Erreur lors de l\'exécution de la requête', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                }
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports.receipt_unValid = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const query = "CALL payment_notvalid_tenant(?)";
                const values = [_tokendata.prTenID];

                try {
                    const [rows] = await pool.query(query, values);
                    console.log('unvalid : ', rows[0]);
                    res.status(200).json(rows[0]);
                } catch (err) {
                    console.error('Erreur lors de l\'exécution de la requête', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                }
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports.receipt_valid = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const query = "CALL payment_valid_tenant(?)";
                const values = [_tokendata.prTenID];

                try {
                    const [rows] = await pool.query(query, values);
                    console.log(rows);
                    res.status(200).json(rows[0]);
                } catch (err) {
                    console.error('Erreur lors de l\'exécution de la requête', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                }
            }
        });
    } catch (error) {
        console.log('Erreur lors de l\'exécution', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
