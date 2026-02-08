const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elearning_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');

    // Delete all participants
    const deleteQuery = 'DELETE FROM participants';

    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error('Error deleting participants:', err);
            db.end();
            return;
        }
        console.log(`Deleted ${result.affectedRows} participants from database`);

        // Reset auto-increment counter
        const resetQuery = 'ALTER TABLE participants AUTO_INCREMENT = 1';
        db.query(resetQuery, (err) => {
            if (err) {
                console.error('Error resetting auto-increment:', err);
            } else {
                console.log('Reset auto-increment counter');
            }
            db.end();
            console.log('All learner data removed successfully!');
        });
    });
});
