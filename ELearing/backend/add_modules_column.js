const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to DB:', err);
        return;
    }
    console.log('Connected to DB. Adding "modules" column to courses table...');

    const query = "ALTER TABLE courses ADD COLUMN modules JSON";
    db.query(query, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column "modules" already exists.');
            } else {
                console.error('Error adding column:', err);
            }
        } else {
            console.log('Successfully added "modules" column.');
        }
        db.end();
    });
});
