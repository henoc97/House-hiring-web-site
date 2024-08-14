

module.exports.tenantProperty = async (req, res) => {
    const query = "CALL tenant_property_by_tenant(?)";
    const values = [req.user.prTenID]; // Utiliser les données du token stockées dans req.user

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log(rows);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release(); // Libérer la connexion à la base de données
    }
};