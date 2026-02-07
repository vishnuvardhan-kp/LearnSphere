const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const inspectSchema = async () => {
    try {
        console.log('Inspecting lessons table schema (JSON)...');
        const res = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'lessons'
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (error) {
        console.error('Error inspecting schema:', error);
    } finally {
        await pool.end();
    }
};

inspectSchema();
