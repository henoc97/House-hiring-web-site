// middlewares/database.js
const pool = require('../../database/database_connection');

module.exports = async (ws, callback) => {
    try {
        ws.connection = await pool.getConnection();
        console.log('Connecté à MySQL');
        await callback(); // Exécuter la prochaine étape

    } catch (err) {
        console.error('Erreur lors de la connexion à la base de données:', err);
        ws.close(4002, 'Erreur de connexion à la base de données');
    }
};
