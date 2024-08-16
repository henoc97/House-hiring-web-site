

// websocketServer.js

const WebSocket = require('ws');
require('dotenv').config();
const dbConnection = require('../middlewares/socket/database');
const tokenVerification = require('../middlewares/socket/auth');
const { ownerMessageSender } = require('../controller/owner/support');
const { tenantMessageSender } = require('../controller/tenant/support');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, request) => {
        // Ajouter une propriété pour suivre l'état de vie du client
        ws.isAlive = true;

        // Vérification du token
        tokenVerification(ws, request, async () => {
            // Connexion à la base de données
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

                // Gérer les messages reçus
                ws.on('message', async (message) => {
                    try {
                        const messageObject = JSON.parse(message);
                        console.log("message: " + messageObject);
                        const isVoid = messageObject.message === '';
                        // Appel du gestionnaire approprié selon le type d'utilisateur
                        if (isOwner && !isVoid) {
                            await ownerMessageSender(ws, messageObject, wss);
                        } else if (isTenant && !isVoid) {
                            await tenantMessageSender(ws, messageObject, wss);
                        }
                    } catch (err) {
                        console.error('Erreur lors du traitement du message:', err);
                    }
                });

                // Gérer le pong reçu en réponse au ping
                ws.on('pong', () => {
                    ws.isAlive = true;
                });

                // Gérer la déconnexion
                ws.on('close', () => {
                    console.log('Client déconnecté');
                    if (ws.connection) {
                        ws.connection.release();  // Libérer la connexion à la base de données
                        console.log('Connexion MySQL libérée');
                    }
                });
            });
        });
    });

    // Mécanisme de ping-pong pour détecter les connexions inactives
    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            if (client.isAlive === false) {
                console.log('Connexion perdue pour le client ID:', client.signID);
                return client.terminate();  // Terminer la connexion si le client ne répond pas
            }

            client.isAlive = false;  // Marquer le client comme non vivant
            client.ping(() => {});   // Envoyer un ping au client
        });
    }, 30000);  // Ping toutes les 30 secondes

    wss.on('close', () => {
        clearInterval(interval);
    });
};