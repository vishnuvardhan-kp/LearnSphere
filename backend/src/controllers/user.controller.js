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

// Get Learners (students) + stats
const getLearners = async (req, res) => {
    try {
        const { search = '' } = req.query;

        let query = `
            SELECT 
                u.id, u.name, u.email, u.avatar_url, u.created_at,
                COUNT(DISTINCT ce.course_id) as enrolled_courses,
                COALESCE(AVG(cp.completion_percentage), 0) as progress_avg,
                (SELECT COUNT(*) FROM course_progress cp2 WHERE cp2.user_id = u.id AND cp2.status = 'COMPLETED') as completed_courses
            FROM users u
            LEFT JOIN course_enrollments ce ON u.id = ce.user_id
            LEFT JOIN course_progress cp ON u.id = cp.user_id AND ce.course_id = cp.course_id
            WHERE u.role = 'LEARNER'
        `;

        const params = [];
        if (search) {
            query += ` AND (u.name ILIKE $1 OR u.email ILIKE $1)`;
            params.push(`%${search}%`);
        }

        query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching learners:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Instructors + stats
const getInstructors = async (req, res) => {
    try {
        const { search = '' } = req.query;

        let query = `
            SELECT 
                u.id, u.name, u.email, u.avatar_url, u.created_at,
                COUNT(DISTINCT c.id) as courses,
                COUNT(DISTINCT ce.user_id) as students,
                COALESCE(AVG(cr.rating), 0) as rating
            FROM users u
            LEFT JOIN courses c ON u.id = c.course_admin_id
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            LEFT JOIN course_reviews cr ON c.id = cr.course_id
            WHERE u.role = 'INSTRUCTOR'
        `;

        const params = [];
        if (search) {
            query += ` AND (u.name ILIKE $1 OR u.email ILIKE $1)`;
            params.push(`%${search}%`);
        }

        query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create Instructor
const createInstructor = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;
        const bcrypt = require('bcrypt');

        // Simple validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, 'INSTRUCTOR')
            RETURNING id, name, email, role, created_at
        `;

        const result = await pool.query(query, [name, email, hashedPassword]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Error creating instructor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    listUsers,
    toggleUserStatus,
    getLearners,
    getInstructors,
    createInstructor
};
