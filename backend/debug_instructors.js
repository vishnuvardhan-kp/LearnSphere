const { pool } = require('./src/db');

async function checkInstructors() {
    try {
        const res = await pool.query("SELECT * FROM users WHERE role = 'INSTRUCTOR'");
        console.log(`Instructors found: ${res.rowCount}`);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
checkInstructors();
