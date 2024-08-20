

module.exports.requireReceipt = async (req, res) => {
    const { sumpayed, monthpayed } = req.body;
    console.log(req.body);
    console.log(req.user.prTenID, sumpayed, monthpayed);
    const query = "CALL insert_payment(?, ?, ?)";
    const values = [req.user.prTenID, sumpayed, monthpayed];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log(rows);
        res.status(200).json({ message: "requête réussie", data: rows[0][0] });
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};


module.exports.receiptUnvalid = async (req, res) => {
    const query = "CALL payment_notvalid_tenant(?)";
    const values = [req.user.prTenID];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log('unvalid : ', rows[0]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};


module.exports.receiptValid = async (req, res) => {
    const query = "CALL payment_valid_tenant(?)";
    const values = [req.user.prTenID];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log(rows);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};
