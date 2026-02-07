const { pool } = require('./src/db');

(async () => {
    try {
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log("Tables: " + tables.rows.map(r => r.table_name).join(', '));
        
        const progressCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='course_progress'");
        console.log("Progress Cols: " + progressCols.rows.map(r => r.column_name).join(', '));
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
