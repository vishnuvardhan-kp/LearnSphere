const { pool } = require('./src/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const query = `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE SET password = $3
            RETURNING *;
        `;
        const values = ['Admin User', 'admin@example.com', hashedPassword, 'ADMIN'];

        const res = await pool.query(query, values);
        if (res.rows.length > 0) {
            console.log('Admin user created:', res.rows[0]);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        await pool.end();
    }
};

seedAdmin();
