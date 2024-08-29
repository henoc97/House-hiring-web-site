const {logger} = require('../../src/logger/logRotation');


/**
 * Handles the creation of a payment receipt.
 * @param {Object} req - The request object containing idTenantProperty, sumpayed, and monthpayed.
 * @param {Object} res - The response object.
 */
module.exports.requireReceipt = async (req, res) => {
    const { idTenantProperty, sumpayed, monthpayed } = req.body;

    // Validate input
    if (idTenantProperty === undefined || sumpayed === undefined || monthpayed === undefined) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const query = "CALL insert_payment(?, ?, ?)";
    const values = [idTenantProperty, sumpayed, monthpayed];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: "Request successful", data: rows[0][0] });
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
 * Retrieves invalid receipts for the current user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports.receiptUnValid = async (req, res) => {
    const query = "CALL payment_notvalid(?)";
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
 * Validates a payment receipt.
 * @param {Object} req - The request object containing the receipt id.
 * @param {Object} res - The response object.
 */
module.exports.validateReceipt = async (req, res) => {
    const { id } = req.body;

    // Validate input
    if (id === undefined) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Missing receipt id' });
    }

    const query = "CALL validate_payment(?)";
    const values = [id];

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
 * Retrieves valid receipts for the current user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports.receiptValid = async (req, res) => {
    const query = "CALL payment_valid(?)";
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
 * Deletes a payment receipt.
 * @param {Object} req - The request object containing the receipt id.
 * @param {Object} res - The response object.
 */
module.exports.deleteReceipt = async (req, res) => {
    const { id } = req.body;

    // Validate input
    if (id === undefined) {
        logger.warn(`400 Bad Request: ${req.method} ${req.url}`);
        return res.status(400).json({ message: 'Missing receipt id' });
    }

    const query = "CALL delete_receipt(?, ?)";
    const values = [id, 'owner'];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows);
    } catch (err) {
        logger.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
