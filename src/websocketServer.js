const WebSocket = require('ws');
require('dotenv').config();
const dbConnection = require('../middlewares/socket/database');
const tokenVerification = require('../middlewares/socket/auth');
const { ownerMessageSender } = require('../controller/owner/support');
const { tenantMessageSender } = require('../controller/tenant/support');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, request) => {
        // Middleware pour la vérification du token
        tokenVerification(ws, request, async () => {
            // Middleware pour la connexion à la base de données
            await dbConnection(ws, async () => {
                console.log('Nouveau client connecté avec ID:', ws.user.userId);

                const isOwner = ws.user.userEmail !== undefined;
                const isTenant = ws.user.prTenID !== undefined;
                
                if (isOwner) {
                    ws.isTenant = false;
                    ws.signID = ws.user.userId; // Signer la connexion
                } else if (isTenant) {
                    ws.isTenant = true;
                    ws.signID = ws.user.userId; // Signer la connexion
                }
                
                ws.on('message', async (message) => {
                    try {
                        const messageObject = JSON.parse(message);
                        console.log("message: " + messageObject);
                        // Appel du gestionnaire approprié selon le type d'utilisateur
                        if (isOwner) {
                            await ownerMessageSender(ws, messageObject, wss);
                        } else if (isTenant) {
                            await tenantMessageSender(ws, messageObject, wss);
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
    });
};
