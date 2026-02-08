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

    // Drop existing table to rebuild with correct schema
    const dropTable = 'DROP TABLE IF EXISTS participants';

    db.query(dropTable, (err) => {
        if (err) {
            console.error('Error dropping table:', err);
            db.end();
            return;
        }
        console.log('Dropped existing participants table');

        const createTable = `
            CREATE TABLE participants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                role VARCHAR(50) DEFAULT 'Student',
                status ENUM('active', 'inactive', 'offline') DEFAULT 'active',
                courses_enrolled INT DEFAULT 0,
                completed_courses INT DEFAULT 0,
                join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                location VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        db.query(createTable, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                db.end();
                return;
            }
            console.log('Created participants table with new schema');

            // Insert sample data (to verify functionality)
            const sampleData = `
                INSERT INTO participants (name, email, role, status, courses_enrolled, completed_courses, join_date, location) VALUES
                ('Alex Johnson', 'alex.j@example.com', 'Student', 'active', 4, 2, '2024-01-15', 'New York, USA'),
                ('Maria Garcia', 'm.garcia@example.com', 'Student', 'offline', 2, 0, '2024-02-02', 'Madrid, Spain'),
                ('David Smith', 'dsmith@example.com', 'Student', 'active', 6, 5, '2023-12-10', 'London, UK'),
                ('Sarah Wilson', 'sarah.w@example.com', 'Student', 'inactive', 1, 0, '2024-03-05', 'Sydney, Australia'),
                ('James Chen', 'j.chen@example.com', 'Student', 'active', 3, 1, '2024-01-28', 'Toronto, Canada'),
                ('Emily Davis', 'emily.d@example.com', 'Student', 'offline', 5, 3, '2023-11-20', 'Berlin, Germany')
            `;

            db.query(sampleData, (err) => {
                if (err) {
                    console.error('Error inserting sample data:', err);
                } else {
                    console.log('Inserted sample participant data');
                }
                db.end();
                console.log('Migration completed successfully!');
            });
        });
    });
});
