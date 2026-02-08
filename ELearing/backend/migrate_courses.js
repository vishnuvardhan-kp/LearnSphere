const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning_db'
});

const queries = [
    "ALTER TABLE courses ADD COLUMN IF NOT EXISTS image VARCHAR(255) AFTER modules",
    "ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.00 AFTER image",
    "ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50) AFTER price",
    "ALTER TABLE courses ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER level"
];

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }

    let completed = 0;
    queries.forEach(query => {
        db.query(query, (err) => {
            if (err) {
                if (err.code === 'ER_PDU_ERROR_NOT_SUPPORTED_YET') {
                    // Some MySQL versions don't support ADD COLUMN IF NOT EXISTS
                } else {
                    console.warn('Query warning/error:', err.message);
                }
            } else {
                console.log('Query success:', query.substring(0, 50) + '...');
            }

            completed++;
            if (completed === queries.length) {
                console.log('Migration finished.');
                db.end();
            }
        });
    });
});
