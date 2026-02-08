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

    // Drop existing table and recreate with new schema
    const dropTable = 'DROP TABLE IF EXISTS instructors';

    db.query(dropTable, (err) => {
        if (err) {
            console.error('Error dropping table:', err);
            db.end();
            return;
        }
        console.log('Dropped existing instructors table');

        const createTable = `
            CREATE TABLE instructors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(100) DEFAULT 'Instructor',
                specialization VARCHAR(255),
                courses INT DEFAULT 0,
                students INT DEFAULT 0,
                rating DECIMAL(2,1) DEFAULT 0.0,
                status ENUM('active', 'inactive') DEFAULT 'active',
                join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        db.query(createTable, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                db.end();
                return;
            }
            console.log('Created instructors table with new schema');

            // Insert sample data
            const sampleData = `
                INSERT INTO instructors (name, email, password, role, specialization, courses, students, rating, status, join_date) VALUES
                ('Sarah Jenkins', 'sarah.j@learnsphere.com', 'password123', 'Senior Instructor', 'Frontend Development', 12, 4500, 4.9, 'active', '2023-01-15'),
                ('Mike Chen', 'mike.c@learnsphere.com', 'password123', 'Instructor', 'Backend & Cloud', 8, 3200, 4.8, 'active', '2023-03-22'),
                ('Jessica Lee', 'jessica.l@learnsphere.com', 'password123', 'Instructor', 'UI/UX Design', 5, 2100, 4.7, 'inactive', '2023-06-10'),
                ('David Kim', 'david.k@learnsphere.com', 'password123', 'Lead Instructor', 'Data Science', 15, 5600, 4.9, 'active', '2022-11-05')
            `;

            db.query(sampleData, (err) => {
                if (err) {
                    console.error('Error inserting sample data:', err);
                } else {
                    console.log('Inserted sample instructor data');
                }
                db.end();
                console.log('Migration completed successfully!');
            });
        });
    });
});
