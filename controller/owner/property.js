const { Property } = require('../../model/property');

module.exports.createProperties = async (req, res) => {
    const { address, description, cost } = req.body;
    const query = "CALL insert_property(?, ?, ?, ?)";
    const values = [req.user.userId, address, description, cost];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json({ message: "requête réussie" });
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.myProperties = async (req, res) => {
    const query = "CALL show_properties(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        const myProperties = rows[0].map(row => Property.jsonTONewProperty(row));
        res.status(200).json(myProperties);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.myProperty = async (req, res) => {
    const { id } = req.body;
    const query = "CALL property_by_id(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.updateProperty = async (req, res) => {
    const { id, address, description, cost } = req.body;
    const query = "CALL update_property(?, ?, ?, ?)";
    const values = [id, address, description, cost];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};
