


module.exports.requireReceipt = async (req, res) => {
    const { idTenantProperty, sumpayed, monthpayed } = req.body;
    const query = "CALL insert_payment(?, ?, ?)";
    const values = [idTenantProperty, sumpayed, monthpayed];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json({ message: "requête réussie", data: rows[0][0] });
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.receiptUnValid = async (req, res) => {
    const query = "CALL payment_notvalid(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.validateReceipt = async (req, res) => {
    const { id } = req.body;
    const query = "CALL validate_payment(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};

module.exports.receiptValid = async (req, res) => {
    const query = "CALL payment_valid(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};


module.exports.deleteReceipt = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_receipt(?, ?)";
    const values = [id, 'owner'];

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