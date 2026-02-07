const { pool } = require('./src/db');

(async () => {
    try {
        const res = await pool.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'lessons'");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
