const WebSocket = require('ws');

module.exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    console.log(req.user.prTenID, message);

    const query = "CALL insert_message_tenant(?, ?)";
    const values = [req.user.prTenID, message];

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

module.exports.tenantMessageSender = (ws, messageObject, wss) => {
    const { tenantId, message } = messageObject;
    console.log(`Message reçu du locataire: ${message}`);

    // Diffuser le message à tous les clients sauf l'expéditeur : ajouter au if "client !== ws"
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });
};


module.exports.myMessages = async (req, res) => {
    console.log('token: ' + JSON.stringify(req.user));
    const query = "CALL get_messages_viewed_by_tenant(?)";
    const values = [req.user.userId]; // tenant ID

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log("my messages : ", rows[0]);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};


module.exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;
    console.log(messageId);

    const query = "CALL update_message_viewed_tenant(?)";
    const values = [messageId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        console.log(rows);
        res.status(200).json({ message: "requête réussie" });
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        req.connection.release();
    }
};
