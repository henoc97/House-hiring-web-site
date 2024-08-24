const WebSocket = require('ws');

module.exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    console.log(req.user.prTenId, message);

    const query = "CALL insert_message_tenant(?, ?)";
    const values = [req.user.prTenId, message];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log(rows[0]);
        res.status(200).json({ message: "requête réussie" });
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
}
};

module.exports.tenantMessageSender = async (ws, messageObject, wss) => {
    const { message } = messageObject;
    console.log(`Message reçu du locataire: ${message}`);

    const query = "CALL insert_message_tenant(?, ?)";
    const values = [ws.user.prTenId, message];

    let result;
    try {
        const [rows] = await ws.connection.query(query, values);
        console.log(rows);
        // Vérifiez que rows contient bien des données
        if (rows && rows.length > 0 && rows[0].length > 0) {
            result = rows[0][0]; // Le premier objet de la première ligne
            console.log("result: " + result);
        } else {
            console.error('Aucune donnée renvoyée par la procédure stockée');
            return; // Sortir si rien n'a été renvoyé
        }
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête', err);
        return; // Sortir en cas d'erreur
    } finally {
        if (ws.connection) {
            ws.connection.release();
        }
    }

    // Diffuser le message à tous les clients, y compris l'expéditeur
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log("-----------SENDER TENANT------------");
            console.log(`Client ID: ${client.signId}, Message au owner ID: ${result.ownerid} , isTenant: ${client.isTenant}`);
            if ((client.signId === ws.signId && client.isTenant) || (client.signId === result.ownerid && !client.isTenant)) {
                console.log(`Envoi du message au client ID: ${client.signId}`);
                client.send(JSON.stringify(result));
            }
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
        if (req.connection) {
            req.connection.release();
        }
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
        if (req.connection) {
            req.connection.release();
        }
    }
};
