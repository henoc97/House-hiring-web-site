const { Property } = require('../../model/property');

/**
 * Creates a new property.
 * @param {Object} req - The request object containing address, description, and cost.
 * @param {Object} res - The response object.
 */
module.exports.createProperties = async (req, res) => {
    const { address, description, cost } = req.body;

    // Validate input
    if (!address || !description || !cost) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const query = "CALL insert_property(?, ?, ?, ?)";
    const values = [req.user.userId, address, description, cost];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('Property created:', rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves properties for the current user based on type.
 * @param {Object} req - The request object containing the property type.
 * @param {Object} res - The response object.
 */
module.exports.myProperties = async (req, res) => {
    const { type } = req.body;

    // Validate input
    if (type === undefined) {
        return res.status(400).json({ message: 'Missing property type' });
    }

    const query = type == 1 ? "CALL show_properties(?)" : "CALL get_unassigned_properties(?)";
    const values = [req.user.userId];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('Properties retrieved:', rows[0]);
        const myProperties = rows[0].map(row => Property.jsonToNewProperty(row));
        res.status(200).json(myProperties);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Retrieves a property by its ID.
 * @param {Object} req - The request object containing the property ID.
 * @param {Object} res - The response object.
 */
module.exports.myProperty = async (req, res) => {
    const { id } = req.body;

    // Validate input
    if (!id) {
        return res.status(400).json({ message: 'Missing property ID' });
    }

    const query = "CALL property_by_id(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('Property retrieved:', rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Updates a property.
 * @param {Object} req - The request object containing id, address, description, and cost.
 * @param {Object} res - The response object.
 */
module.exports.updateProperty = async (req, res) => {
    const { id, address, description, cost } = req.body;

    // Validate input
    if (!id || !address || !description || !cost) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const query = "CALL update_property(?, ?, ?, ?)";
    const values = [id, address, description, cost];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('Property updated:', rows[0]);
        res.status(200).json(rows[0][0]);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};

/**
 * Deletes a property.
 * @param {Object} req - The request object containing the property ID.
 * @param {Object} res - The response object.
 */
module.exports.deleteProperty = async (req, res) => {
    const { id } = req.body;

    // Validate input
    if (!id) {
        return res.status(400).json({ message: 'Missing property ID' });
    }

    const query = "CALL delete_property(?)";
    const values = [id];

    try {
        const [rows] = await req.connection.query(query, values);
        console.log('Property deleted:', rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (req.connection) {
            req.connection.release();
        }
    }
};
