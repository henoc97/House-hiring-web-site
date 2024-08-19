const crypto = require('crypto');

module.exports.createTenant = async (req, res) => {
    const { id, lastname, firstname, contactmoov, contacttg } = req.body;
    const keyword = crypto.randomBytes(4).toString('hex');
    const query = "CALL insert_tenant(?, ?, ?, ?, ?, ?, ?)";
    const values = [id, req.user.userId, keyword, lastname, firstname, contactmoov, contacttg];

    try {
        const [rows] = await req.connection.query(query, values);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.tenantsProperties = async (req, res) => {
    const query = "CALL tenant_properties_by_owner(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.recentTenants = async (req, res) => {
    const query = "CALL recent_tenants(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.allTenants = async (req, res) => {
    const query = "CALL alltenants(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.myTenant = async (req, res) => {
    const { id } = req.body;
    const query = "CALL tenant_by_id(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports.updateTenant = async (req, res) => {
    const { id, firstname, lastname, contactmoov, contacttg, date } = req.body;
    const query = "CALL update_tenant(?, ?, ?, ?, ?, ?)";
    const values = [id, lastname, firstname, contactmoov, contacttg, date];

    try {
        const [rows] = await req.connection.query(query, values);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};



module.exports.deleteTenant = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_tenant(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.deletePropertyTenant = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_property_tenant(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};