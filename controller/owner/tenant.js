const crypto = require('crypto');
const {logger} = require('../../src/logger/logRotation');

/**
 * Creates a new tenant in the database.
 * @param {Object} req - The request object containing tenant details.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.createTenant = async (req, res) => {
    const { id, lastname, firstname, contactmoov, contacttg } = req.body;
    const keyword = crypto.randomBytes(4).toString('hex');
    const query = "CALL insert_tenant(?, ?, ?, ?, ?, ?, ?)";
    const values = [id, req.user.userId, keyword, lastname, firstname, contactmoov, contacttg];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves the properties of tenants for a specific owner.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.tenantsProperties = async (req, res) => {
    const query = "CALL tenant_properties_by_owner(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves the properties of tenants for a specific owner and address.
 * @param {Object} req - The request object containing the user ID and property address.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.searchTenantsProperties = async (req, res) => {
    const {address} = req.body;
    const query = "CALL search_by_address_tenant_properties_by_owner(?, ?)";
    const values = [req.user.userId, address];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves recent tenants for a specific owner.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.recentTenants = async (req, res) => {
    const query = "CALL recent_tenants(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves all tenants for a specific owner.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.allTenants = async (req, res) => {
    const query = "CALL alltenants(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves searched tenants for a specific owner.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.searchTenants = async (req, res) => {
    const {lastname, firstname} = req.body;
    const query = "CALL search_tenants(?, ?, ?)";
    const values = [req.user.userId, lastname, firstname];
    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves a specific tenant by ID.
 * @param {Object} req - The request object containing the tenant ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.myTenant = async (req, res) => {
    const { id } = req.body;
    const query = "CALL tenant_by_id(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates the details of a specific tenant.
 * @param {Object} req - The request object containing tenant details.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.updateTenant = async (req, res) => {
    const { id, firstname, lastname, contactmoov, contacttg, date } = req.body;
    const query = "CALL update_tenant(?, ?, ?, ?, ?, ?)";
    const values = [id, lastname, firstname, contactmoov, contacttg, date];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json(rows[0][0]);
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates the connection key of a tenant.
 * @param {Object} req - The request object containing tenant ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.updateTenantConnectKey = async (req, res) => {
    const { id } = req.body;
    const keyword = crypto.randomBytes(4).toString('hex');
    const query = "CALL update_tenant_key(?, ?)";
    const values = [id, keyword];

    try {
        const [rows] = await req.connection.query(query, values);
        logger.info(`200 OK: ${req.method} ${req.url}`);
        res.status(200).json({ key: keyword });
    } catch (queryError) {
        logger.error('Error executing query:', queryError);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Deletes a tenant from the database.
 * @param {Object} req - The request object containing tenant ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.deleteTenant = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_tenant(?)";
    const values = [id];

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

/**
 * Deletes a property associated with a tenant.
 * @param {Object} req - The request object containing property ID.
 * @param {Object} res - The response object used to send the response.
 * @returns {void}
 */
module.exports.deletePropertyTenant = async (req, res) => {
    const { id } = req.body;
    const query = "CALL delete_property_tenant(?)";
    const values = [id];

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
