const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const debugLogin = async () => {
    try {
        console.log('--- DEBUG LOGIN ---');
        const email = 'admin@example.com';
        const password = 'password123';

        // 1. Fetch User
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) {
            console.log('User not found!');
            return;
        }

        const user = res.rows[0];
        console.log(`User Found: ID=${user.id}, Role=${user.role}`);
        console.log(`Stored Hash: ${user.password}`);

        // 2. Compare Password
        const match = await bcrypt.compare(password, user.password);
        console.log(`Password 'password123' match? ${match}`);

        if (!match) {
            console.log('Resetting password to password123...');
            const newHash = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, user.id]);
            console.log('Password updated.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
};

debugLogin();
