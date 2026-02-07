const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/learnsphere'
});

async function checkCols() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
        console.log('Users columns:', res.rows.map(r => r.column_name).join(', '));
        
        const res2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'courses'");
        console.log('Courses columns:', res2.rows.map(r => r.column_name).join(', '));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkCols();
