const { pool } = require('../db');

// List users with optional role filtering
const listUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT id, name, email, role, avatar_url, created_at FROM users';
        const params = [];

        if (role) {
            query += ' WHERE role = $1';
            params.push(role);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Count for pagination
        let countQuery = 'SELECT COUNT(*) FROM users';
        if (role) {
            countQuery += ' WHERE role = $1';
        }
        const countResult = await pool.query(countQuery, role ? [role] : []);

        res.json({
            data: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].count),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Toggle User Status (Activation)
const toggleUserStatus = async (req, res) => {
    // STRICT SCHEMA LIMITATION:
    // The 'users' table does NOT have an 'is_active' or 'status' column.
    // Changing the schema is forbidden. 
    // Therefore, this feature cannot be implemented.
    res.status(501).json({
        error: 'Not Implemented',
        message: 'User activation/deactivation is not supported by the current strict schema (missing status column).'
    });
};

module.exports = {
    listUsers,
    toggleUserStatus
};
