const {logger} = require('../../src/logger/logRotation');


/**
 * Handles the process of inserting a payment record for a tenant.
 *
 * @param {Object} req - The request object containing the payment details.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>}
 */
module.exports.requireReceipt = async (req, res) => {
    const { sumpayed, accessoryFees, ref, method, monthpayed, createDate } = req.body;

    // Validate input
    if (
        sumpayed === undefined || 
        accessoryFees === undefined || 
        ref === undefined || 
        method === undefined || 
        createDate === undefined || 
        monthpayed === undefined) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const query = "CALL insert_payment(?, ?, ?, ?, ?, ?, ?)";
    const values = [req.user.prTenId, sumpayed, accessoryFees, monthpayed, ref, method, createDate];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: "Request successful", data: rows[0][0] });
    } catch (err) {
        logger.error('Error executing query in requireReceipt:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};


/**
 * Retrieves invalid payment records for a tenant.
 *
 * @param {Object} req - The request object containing tenant information.
 * @param {Object} res - The response object used to send the invalid payment records back to the client.
 * @returns {Promise<void>}
 */
module.exports.receiptUnvalid = async (req, res) => {
    const query = "CALL payment_notvalid_tenant(?)";
    const values = [req.user.prTenId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (err) {
        logger.error('Error executing query in receiptUnvalid:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};



/**
 * Retrieves valid payment records for a tenant.
 *
 * @param {Object} req - The request object containing tenant information.
 * @param {Object} res - The response object used to send the valid payment records back to the client.
 * @returns {Promise<void>}
 */
module.exports.receiptValid = async (req, res) => {
    const query = "CALL payment_valid_tenant(?)";
    const values = [req.user.prTenId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (err) {
        logger.error('Error executing query in receiptValid:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};


/**
 * Deletes a receipt record or marks it as deleted for a tenant.
 *
 * @param {Object} req - The request object containing the receipt ID.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>}
 */
module.exports.deleteReceipt = async (req, res) => {
    const { id } = req.body;

    // Validate input
    if (!id) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Invalid receipt ID' });
    }

    const query = "CALL delete_receipt(?, ?)";
    const values = [id, 'tenant'];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows);
    } catch (err) {
        logger.error('Error executing query in deleteReceipt:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
