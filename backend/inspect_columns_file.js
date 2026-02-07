const { Pool } = require('pg');
const fs = require('fs');
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
        fs.writeFileSync('columns.txt', columns.join(', '), 'utf8');
        console.log('Columns written to columns.txt');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
};

inspectColumns();
