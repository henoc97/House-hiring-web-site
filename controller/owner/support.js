const WebSocket = require('ws');


module.exports.sendMessage = async (req, res) => {
    const { tenantId, message } = req.body;
    const query = "CALL insert_message_owner(?, ?, ?)";
    const values = [req.user.userId, tenantId, message];

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

module.exports.ownerMessageSender = (ws, messageObject, wss) => {
    const { tenantId, message } = messageObject;
    console.log(`Message reçu du propriétaire pour le tenant ID ${tenantId}: ${message}`);

    // Diffuser le message à tous les clients sauf l'expéditeur : ajouter au if "client !== ws"
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });
};

module.exports.myMessages = async (req, res) => {
    const { tenantId } = req.body;
    const query = "CALL get_messages_viewed_by_owner(?)";
    const values = [tenantId];

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

module.exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;
    const query = "CALL update_message_viewed_owner(?)";
    const values = [messageId];

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
