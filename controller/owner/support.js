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

module.exports.ownerMessageSender = async (ws, messageObject, wss) => {
    const { tenantId, message } = messageObject;
    console.log(`Message reçu du propriétaire pour le tenant ID ${tenantId}:{ ${message} }`);
    
    const query = "CALL insert_message_owner(?, ?, ?)";
    const values = [ws.user.userId, tenantId, message];
    
    let result;
    try {
        const [rows] = await ws.connection.query(query, values);
        console.log(rows);
        // Vérifiez que rows contient bien des données
        if (rows && rows.length > 0 && rows[0].length > 0) {
            result = rows[0][0]; // Le premier objet de la première ligne
        } else {
            console.error('Aucune donnée renvoyée par la procédure stockée');
            return; // Sortir si rien n'a été renvoyé
        }
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        return; // Sortir en cas d'erreur
    } finally {
        ws.connection.release();
    }

    // Diffuser le message à tous les clients meme à l'expéditeur
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(result)); // Envoyer le message inséré aux clients
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
