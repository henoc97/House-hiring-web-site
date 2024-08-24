

module.exports.tenantProperty = async (req, res) => {
    const query = "CALL tenant_property_by_tenant(?)";
    const values = [req.user.prTenId]; // Utiliser les données du token stockées dans req.user

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log(rows);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.myProperty = async (req, res) => {
    // const query = "CALL property_by_pr_ten_id(?)";
    // const values = [req.user.prTenId];

    // try {
    //     const [rows] = await req.connection.query(query, values);
    //     console.log(rows[0]);
    //     res.status(200).json(rows[0][0]);
    // } catch (err) {
    //     console.error('Erreur lors de l\'exécution de la requête', err);
    //     res.status(500).json({ message: 'Erreur serveur' });
    // } finally {
    //     req.connection.release();
    // }
};