const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/learnsphere'
});

async function fixSchema() {
    try {
        console.log('Fixing Users table...');
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;");
        
        console.log('Fixing Courses table...');
        await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;");
        await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;");
        await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_admin_id INT REFERENCES users(id);"); 
        
        console.log('Fixing Lessons table...');
        await pool.query("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_minutes INT;");

        console.log('Schema fixed successfully.');
    } catch (err) {
        console.error('Error fixing schema:', err);
    } finally {
        pool.end();
    }
}

fixSchema();
