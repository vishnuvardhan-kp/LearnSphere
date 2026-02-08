const db = require('./db');

const createEnrollmentsTable = `
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    course_id INT NOT NULL,
    progress INT DEFAULT 0,
    status ENUM('enrolled', 'in-progress', 'completed') DEFAULT 'enrolled',
    completed_at DATETIME,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (participant_id, course_id)
);
`;

db.query(createEnrollmentsTable, (err, result) => {
    if (err) {
        console.error('Error creating enrollments table:', err);
    } else {
        console.log('Enrollments table created successfully or already exists.');
    }
    process.exit();
});

