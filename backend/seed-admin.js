const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const seedAdmin = async () => {
    try {
        const email = 'admin@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            console.log('Admin user already exists. Updating password...');
            const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
            await pool.query(updateQuery, [hashedPassword, email]);
            console.log('✅ Admin password updated to: password123');
        } else {
            const insertQuery = `
                INSERT INTO users (name, email, password, role)
                VALUES ($1, $2, $3, 'ADMIN')
                RETURNING id, email, role;
            `;
            const result = await pool.query(insertQuery, ['Admin User', email, hashedPassword]);
            console.log('✅ Admin user created successfully!');
            console.log(`Email: ${result.rows[0].email}`);
            console.log(`Password: ${password}`);
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await pool.end();
    }
};

seedAdmin();
