// websocketServer.js

const WebSocket = require('ws');
require('dotenv').config();
const dbConnection = require('../middlewares/socket/database');
const tokenVerification = require('../middlewares/socket/auth');
const { ownerMessageSender } = require('../controller/owner/support');
const { tenantMessageSender } = require('../controller/tenant/support');
const {logger} = require('./logger/logRotation');

/**
 * Initializes WebSocket server and handles WebSocket connections.
 * @param {Object} server - The HTTPS server to attach the WebSocket server to.
 */
module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, request) => {
        // Initialize connection state
        ws.isAlive = true;

        // Verify token and handle database connection
        tokenVerification(ws, request, async () => {
            try {
                dbConnection(ws, () => {

                    // Determine user type and handle accordingly
                    const isOwner = ws.user.userEmail !== undefined;
                    const isTenant = ws.user.prTenId !== undefined;

                    ws.isTenant = isTenant;
                    ws.signId = ws.user.userId; // Set user ID for the session


                    // Handle incoming messages
                    ws.on('message', async (message) => {
                        try {
                            const messageObject = JSON.parse(message);

                            if (messageObject.message === '') {
                                return; // Ignore empty messages
                            }

                            // Delegate message handling based on user type
                            if (isOwner) {
                                await ownerMessageSender(ws, messageObject, wss);
                            } else if (isTenant) {
                                await tenantMessageSender(ws, messageObject, wss);
                            }
                        } catch (err) {
                            logger.error('Error processing message:', err);
                        }
                    });

                    // Handle pong responses to pings
                    ws.on('pong', () => {
                        ws.isAlive = true;
                    });

                    // Handle client disconnection
                    ws.on('close', () => {
                        if (ws.connection) {
                            ws.connection.release(); // Release database connection
                        }
                    });
                });
            } catch (err) {
                logger.error('Error handling WebSocket connection:', err);
            }
        });
    });

    // Periodic ping-pong to detect inactive connections
    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            if (client.isAlive === false) {
                return client.terminate();  // Terminate inactive connection
            }

            client.isAlive = false;  // Mark client as not alive
            client.ping();           // Send ping to client
        });
    }, 30000);  // Ping every 30 seconds

    wss.on('close', () => {
        clearInterval(interval);  // Clean up interval on server close
    });
};
