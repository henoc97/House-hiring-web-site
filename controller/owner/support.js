const WebSocket = require('ws');
const {logger} = require('../../src/logger/logRotation');

/**
 * Handles sending a message from an owner to a tenant.
 * @param {Object} req - The request object containing tenantId and message.
 * @param {Object} res - The response object.
 */
module.exports.sendMessage = async (req, res) => {
    const { tenantId, message } = req.body;

    // Validate input
    if (!tenantId || !message) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const query = "CALL insert_message_owner(?, ?, ?)";
    const values = [req.user.userId, tenantId, message];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('Message inserted:', rows[0]);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: "Request successful" });
    } catch (err) {
        logger.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Handles the WebSocket message sending from an owner to a tenant.
 * @param {WebSocket} ws - The WebSocket connection object for the owner.
 * @param {Object} messageObject - Object containing tenantId and message.
 * @param {WebSocket.Server} wss - The WebSocket server instance.
 */
module.exports.ownerMessageSender = async (ws, messageObject, wss) => {
    const { tenantId, message } = messageObject;

    // Validate input
    if (!tenantId || !message) {
        logger.error('Missing data for message sending');
        return;
    }

    console.log(`Received message from owner for tenant ID ${tenantId}: ${message}`);

    const query = "CALL insert_message_owner(?, ?, ?)";
    const values = [ws.user.userId, tenantId, message];

    let result;
    try {
        const [rows] = await ws.connection.query(query, values);
        if (rows && rows.length > 0 && rows[0].length > 0) {
            result = rows[0][0]; // First object of the first row
        } else {
            logger.error('No data returned by the stored procedure');
            return;
        }
    } catch (err) {
        logger.error('Error executing query:', err);
        return;
    } finally {
        if (ws.connection) {
            ws.connection.release();
        }
    }

    // Broadcast the message to all clients including the sender
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if ((client.signId === ws.signId && !client.isTenant) || (client.signId === result.tenantid && client.isTenant)) {
                client.send(JSON.stringify(result));
            }
        }
    });
};

/**
 * Retrieves messages viewed by a specific owner for a tenant.
 * @param {Object} req - The request object containing tenantId.
 * @param {Object} res - The response object.
 */
module.exports.myMessages = async (req, res) => {
    const { tenantId } = req.body;

    // Validate input
    if (!tenantId) {
        return res.status(400).json({ message: 'Missing tenantId' });
    }

    const query = "CALL get_messages_viewed_by_owner(?)";
    const values = [tenantId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (err) {
        logger.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves recent messages for the logged-in owner.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports.recentMessages = async (req, res) => {
    const query = "CALL recent_messages_for_owner(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (err) {
        logger.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Marks a message as viewed by the owner.
 * @param {Object} req - The request object containing messageId.
 * @param {Object} res - The response object.
 */
module.exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;

    // Validate input
    if (!messageId) {
        return res.status(400).json({ message: 'Missing messageId' });
    }

    const query = "CALL update_message_viewed_owner(?)";
    const values = [messageId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: "Request successful" });
    } catch (err) {
        logger.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
