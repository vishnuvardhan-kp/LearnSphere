const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/learnsphere'
});

async function run() {
    try {
        await pool.query('SELECT u.avatar_url FROM users u LIMIT 1');
        console.log('avatar_url exists');
    } catch (e) {
        console.log('avatar_url ERROR:', e.message);
    }

    try {
        await pool.query("SELECT * FROM users WHERE role = 'INSTRUCTOR' LIMIT 1");
        console.log('role column exists');
    } catch (e) {
         console.log('role ERROR:', e.message);
    }
    
    try {
         await pool.query("SELECT * FROM course_reviews LIMIT 1");
         console.log('course_reviews exists');
    } catch (e) {
         console.log('course_reviews ERROR:', e.message);
    }
    
    pool.end();
}

run();
