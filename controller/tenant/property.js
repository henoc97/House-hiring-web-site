
const pool = require("../../database/database_connection");
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports.tenantProperty = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (_err, _tokendata) => {
            if (_err) {
                return res.status(403).json({ message: 'Token not valid' });
            } else {
                const query = "CALL tenant_property_by_tenant(?)";
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