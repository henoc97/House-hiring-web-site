
/**
 * Retrieves the properties associated with a tenant.
 *
 * This function executes a stored procedure to get property details for the tenant
 * specified by the `prTenId` in the request user's token.
 *
 * @param {Object} req - The request object containing user information and database connection.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>} - Sends a JSON response with the property details or an error message.
 */
module.exports.tenantProperty = async (req, res) => {
    const query = "CALL tenant_property_by_tenant(?)";
    const values = [req.user.prTenId]; // Use tenant ID from the token stored in req.user

    try {
        const [rows] = await req.connection.query(query, values);

        // Check if rows contain data
        if (rows && rows.length > 0) {
            console.log('Properties retrieved:', rows[0]);
            res.status(200).json(rows[0]);
        } else {
            console.warn('No properties found for tenant ID:', req.user.prTenId);
            res.status(404).json({ message: 'No properties found' });
        }
    } catch (err) {
        console.error('Error executing query in tenantProperty:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        // Release the connection to the pool
        if (req.connection) {
            req.connection.release();
        }
    }
};
