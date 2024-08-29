const WebSocket = require('ws');
const {logger} = require('../../src/logger/logRotation');

/**
 * Handles sending a message from a tenant.
 *
 * @param {Object} req - The request object containing the message data.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>}
 */
module.exports.sendMessage = async (req, res) => {
    const { message } = req.body;

    // Validate input
    if (!message) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Message content is required and must be a string.' });
    }

    const query = "CALL insert_message_tenant(?, ?)";
    const values = [req.user.prTenId, message];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (err) {
        logger.error('Error executing query in sendMessage:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};


/**
 * Handles the process of sending a message from a tenant via WebSocket.
 *
 * @param {WebSocket} ws - The WebSocket connection object for the tenant.
 * @param {Object} messageObject - The message object containing the message content.
 * @param {WebSocket.Server} wss - The WebSocket server instance to broadcast messages.
 * @returns {Promise<void>}
 */
module.exports.tenantMessageSender = async (ws, messageObject, wss) => {
    const { message } = messageObject;

    // Validate input
    if (!message) {
        logger.error('Invalid message received:', messageObject);
        return;
    }

    const query = "CALL insert_message_tenant(?, ?)";
    const values = [ws.user.prTenId, message];

    let result;
    try {
        const [rows] = await ws.connection.query(query, values);
        if (rows && rows.length > 0 && rows[0].length > 0) {
            result = rows[0][0]; // Get the first object from the first row
        } else {
            logger.error('No data returned by the stored procedure');
            return;
        }
    } catch (err) {
        logger.error('Error executing query in tenantMessageSender:', err);
        return;
    } finally {
        if (ws.connection) {
            ws.connection.release();
        }
    }

    // Broadcast the message to relevant clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if ((client.signId === ws.signId && client.isTenant) || (client.signId === result.ownerid && !client.isTenant)) {
                client.send(JSON.stringify(result));
            }
        }
    });
};


/**
 * Retrieves messages viewed by the tenant.
 *
 * @param {Object} req - The request object containing tenant information.
 * @param {Object} res - The response object used to send the messages back to the client.
 * @returns {Promise<void>}
 */
module.exports.myMessages = async (req, res) => {
    const query = "CALL get_messages_viewed_by_tenant(?)";
    const values = [req.user.userId]; // Tenant ID

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (err) {
        logger.error('Error executing query in myMessages:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};



/**
 * Deletes or marks a message as viewed by updating its status.
 *
 * @param {Object} req - The request object containing the message ID to be updated.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>}
 */
module.exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;

    // Validate input
    if (!messageId) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Valid message ID is required.' });
    }

    const query = "CALL update_message_viewed_tenant(?)";
    const values = [messageId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: 'Message updated successfully' });
    } catch (err) {
        logger.error('Error executing query in deleteMessage:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
