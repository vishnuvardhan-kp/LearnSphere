const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(userQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // 2. Check if user is ADMIN
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only Admins can log in here.' });
        }

        // 3. Verify Password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login
};
