const pool = require("../../database/database_connection");
const { Property } = require('../../model/property');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.createProperties = async (req, res) => {
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
                const { address, description, cost } = req.body;
                const query = "CALL insert_property(?, ?, ?, ?)";
                const values = [_tokendata.userId, address, description, cost];

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

module.exports.myProperties = async (req, res) => {
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
                const query = "CALL show_properties(?)";
                const values = [_tokendata.userId];

                try {
                    const [rows] = await connection.query(query, values);
                    console.log("ici : ", rows[0]);
                    const myProperties = rows[0].map(row => Property.jsonTONewProperty(row));
                    console.log("myProperties: ", myProperties);
                    res.status(200).json(myProperties);
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


module.exports.myProperty = async (req, res) => {
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
                const { id } = req.body;
                const query = "CALL property_by_id(?)";
                const values = [id];

                try {
                    const [rows] = await connection.query(query, values);
                    console.log("property_by_id : ", rows[0]);
                    console.log("property_by_id[0]: ", rows[0][0]);
                    res.status(200).json(rows[0][0]);
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


module.exports.updateProperty = async (req, res) => {
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
                const { id, address, description, cost } = req.body;
                const query = "CALL update_property(?, ?, ?, ?)";
                const values = [id, address, description, cost];

                try {
                    const [rows] = await connection.query(query, values);
                    res.status(200).json(rows[0][0]);
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