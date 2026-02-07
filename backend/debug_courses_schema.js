const { pool } = require('./src/db');

async function checkCoursesSchema() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'courses'
        `);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
checkCoursesSchema();
