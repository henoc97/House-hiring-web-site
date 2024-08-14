
// middlewares/database.js
const pool = require('../database/database_connection');

module.exports = async (req, res, next) => {
    try {
        req.connection = await pool.getConnection();
        console.log('Connecté à MySQL');
        next(); // Passer au prochain middleware ou contrôleur
    } catch (err) {
        console.error('Erreur de connexion au pool', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
