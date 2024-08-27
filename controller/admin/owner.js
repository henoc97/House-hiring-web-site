const crypto = require('crypto');

module.exports.mySubscription = async (req, res) => {
    const { id } = req.body;
    const query = "CALL get_subscription_by_id(?)";
    const values = [id];
    
    try {
        const [rows] = await req.connection.query(query, values);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.updateOwnerSold = async (req, res) => {
    const { id, ref, method } = req.body;
    const query = "CALL update_owner_sold(?, ?, ?)";
    const values = [id, ref, method];
    console.log("object: " + JSON.stringify(values));
    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows);
        res.status(200).json({message: 'requête réussie' });
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.subscriptions = async (req, res) => {
    const query = "CALL get_all_subscriptions()";
    try {
        const [rows] = await req.connection.query(query);
        console.log("ce que je veux : " + rows[0]);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.insertSubscription = async (req, res) => {
    const { email, ref, sumpaid, method } = req.body;
    const query = "CALL insert_subscription(?, ?, ?, ?)";
    const values = [email, ref, sumpaid, method];
    console.log(email, ref, sumpaid, method);
    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.deleteSubscription = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_subscription(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

module.exports.isDeletedSubscription = async (req, res) => {
    const { id } = req.body;
    const query = "CALL is_deleted_subscription(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('object', rows);
        res.status(200).json({message: 'requête réussie' });
    } catch (queryError) {
        console.error('Erreur lors de l\'exécution de la requête', queryError);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
