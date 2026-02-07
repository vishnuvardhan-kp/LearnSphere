const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/learnsphere'
});

async function checkUser() {
    try {
        const res = await pool.query("SELECT id, name, email, role FROM users WHERE email = 'user@example.com'");
        if (res.rows.length > 0) {
            console.log('User found:', res.rows[0]);
        } else {
            console.log('User NOT found: user@example.com');
        }
    } catch (err) {
        console.error('Database error:', err);
    } finally {
        pool.end();
    }
}

checkUser();
