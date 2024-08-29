const crypto = require('crypto');
const {logger} = require('../../src/logger/logRotation');

/**
 * Retrieves subscription information by its ID.
 * @param {Object} req - The HTTP request object containing the ID in the request body.
 * @param {Object} res - The HTTP response object.
 */
module.exports.mySubscription = async (req, res) => {
    const { id } = req.body;
    const query = "CALL get_subscription_by_id(?)";
    const values = [id];
    
    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        logger.error('Error executing query', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates the sold status of an owner.
 * @param {Object} req - The HTTP request object containing the necessary information for the update.
 * @param {Object} res - The HTTP response object.
 */
module.exports.updateOwnerSold = async (req, res) => {
    const { id, ref, method } = req.body;
    const query = "CALL update_owner_sold(?, ?, ?)";
    const values = [id, ref, method];
    
    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: 'Update successful' });
    } catch (queryError) {
        logger.error('Error executing query', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves all subscriptions.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
module.exports.subscriptions = async (req, res) => {
    const query = "CALL get_all_subscriptions()";
    
    try {
        const [rows] = await req.connection.query(query);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        logger.error('Error executing query', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Inserts a new subscription.
 * @param {Object} req - The HTTP request object containing subscription details in the body.
 * @param {Object} res - The HTTP response object.
 */
module.exports.insertSubscription = async (req, res) => {
    const { email, ref, sumpaid, method } = req.body;
    const query = "CALL insert_subscription(?, ?, ?, ?)";
    const values = [email, ref, sumpaid, method];
    
    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        logger.error('Error executing query', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Deletes a subscription by its ID.
 * @param {Object} req - The HTTP request object containing the ID in the body.
 * @param {Object} res - The HTTP response object.
 */
module.exports.deleteSubscription = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_subscription(?)";
    const values = [id];
    
    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        logger.error('Error executing query', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Set subscription as it has been deleted.
 * @param {Object} req - The HTTP request object containing the ID in the body.
 * @param {Object} res - The HTTP response object.
 */
module.exports.isDeletedSubscription = async (req, res) => {
    const { id } = req.body;
    const query = "CALL is_deleted_subscription(?)";
    const values = [id];
    
    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ message: 'Request successful' });
    } catch (queryError) {
        logger.error('Error executing query', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
