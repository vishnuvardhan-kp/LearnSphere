const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const inspectColumns = async () => {
    try {
        const res = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'lessons'
        `);
        const columns = res.rows.map(r => r.column_name);
        console.log('LESSONS_COLUMNS:', columns.join(', '));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
};

inspectColumns();
