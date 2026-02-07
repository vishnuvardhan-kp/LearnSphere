const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

// Unified Login for Instructors and Learners
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

        // 2. Check if user is INSTRUCTOR or LEARNER (not admin)
        if (user.role !== 'instructor' && user.role !== 'learner') {
            return res.status(403).json({ error: 'Access denied. This login is for instructors and learners only.' });
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
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Signup for Learners ONLY
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if email already exists
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create learner account
        const insertQuery = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, 'learner')
            RETURNING id, name, email, role, created_at
        `;

        const result = await pool.query(insertQuery, [name, email, hashedPassword]);
        const newUser = result.rows[0];

        // Initialize user points
        await pool.query('INSERT INTO user_points (user_id, total_points) VALUES ($1, 0)', [newUser.id]);

        // Generate JWT
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login,
    signup
};
