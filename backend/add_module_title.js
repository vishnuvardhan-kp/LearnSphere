const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const addModuleTitle = async () => {
    try {
        console.log('Adding module_title column to lessons table...');
        await pool.query('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS module_title VARCHAR(255)');
        console.log('Column added successfully.');
    } catch (error) {
        console.error('Error altering table:', error);
    } finally {
        await pool.end();
    }
};

addModuleTitle();
