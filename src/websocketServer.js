const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ownerMessageSender } = require('../controller/owner/support');
const { tenantMessageSender } = require('../controller/tenant/support');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, request) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const token = url.searchParams.get('token');

        console.log('Token reçu:', token);

        if (!token) {
            ws.close(4000, 'Token manquant');
            console.log('Token manquant');
            return;
        }

        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
                ws.close(4001, 'Token invalide');
                console.log('Token invalide');
                return;
            }

            // Identification de l'utilisateur à partir du token
            const isOwner = decoded.userEmail !== undefined;
            const isTenant = decoded.prTenID !== undefined;

            console.log('Nouveau client connecté avec ID:', decoded.userId);

            ws.on('message', (message) => {
                try {
                    const messageObject = JSON.parse(message);

                    // Appel du gestionnaire approprié selon le type d'utilisateur
                    if (isOwner) {
                        ownerMessageSender(ws, messageObject, wss);
                    } else if (isTenant) {
                        tenantMessageSender(ws, messageObject, wss);
                    }
                } catch (err) {
                    console.error('Erreur lors du traitement du message:', err);
                }
            });

            ws.on('close', () => {
                console.log('Client déconnecté');
            });
        });
    });
};
