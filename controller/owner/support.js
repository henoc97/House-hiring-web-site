const pool = require("../../database/database_connection");
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.sendMessage = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        console.log('Connecté à MySQL');

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const { tenantId, message } = req.body;
                const query = "CALL insert_message_owner(?, ?, ?)";
                const values = [_tokendata.userId, tenantId, message];

                try {
                    const [rows] = await connection.query(query, values);
                    res.status(200).json({ message: "requête réussie" });
                } catch (err) {
                    console.error('Erreur lors de l\'exécution de la requête', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                } finally {
                    connection.release();
                }
            }
        });
    } catch (err) {
        console.error('Erreur de connexion au pool', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports.myMessages = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        console.log('Connecté à MySQL');

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const { tenantId } = req.body;
                const query = "CALL get_messages_viewed_by_owner(?)";
                const values = [tenantId];

                try {
                    const [rows] = await connection.query(query, values);
                    console.log("ici : ", rows[0]);
                    res.status(200).json(rows[0]);
                } catch (err) {
                    console.error('Erreur lors de l\'exécution de la requête', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                } finally {
                    connection.release();
                }
            }
        });
    } catch (err) {
        console.error('Erreur de connexion au pool', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports.deleteMessage = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        console.log('Connecté à MySQL');

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const { messageId } = req.body;
                console.log(_tokendata.userId, messageId);
                const query = "CALL update_message_viewed_owner(?)";
                const values = [messageId];

                try {
                    const [rows] = await connection.query(query, values);
                    res.status(200).json({ message: "requête réussie" });
                } catch (err) {
                    console.error('Erreur lors de l\'exécution de la requête', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                } finally {
                    connection.release();
                }
            }
        });
    } catch (err) {
        console.error('Erreur de connexion au pool', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}