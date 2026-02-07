/**
 * Seed test users for Instructor and Learner frontends
 * Password for all test users: password123
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const seedTestUsers = async () => {
    try {
        console.log('=== Seeding Test Users ===\n');

        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Test Instructors
        const instructors = [
            { name: 'Test Instructor', email: 'instructor@test.com', role: 'INSTRUCTOR' },
            { name: 'Sarah Wilson', email: 'sarah.instructor@test.com', role: 'INSTRUCTOR' },
        ];

        console.log('--- Creating Instructors ---');
        for (const user of instructors) {
            const checkQuery = 'SELECT * FROM users WHERE email = $1';
            const checkResult = await pool.query(checkQuery, [user.email]);

            if (checkResult.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO users (name, email, password, role, created_at)
                    VALUES ($1, $2, $3, $4, NOW())
                    RETURNING id
                `;
                const res = await pool.query(insertQuery, [user.name, user.email, hashedPassword, user.role]);
                console.log(`Created instructor: ${user.name} (ID: ${res.rows[0].id})`);
            } else {
                // Update password if user exists
                await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, user.email]);
                console.log(`Instructor exists, updated password: ${user.name}`);
            }
        }

        // Test Learners
        const learners = [
            { name: 'Test Learner', email: 'learner@test.com', role: 'LEARNER' },
            { name: 'John Doe', email: 'john.learner@test.com', role: 'LEARNER' },
            { name: 'Jane Smith', email: 'jane.learner@test.com', role: 'LEARNER' },
        ];

        console.log('\n--- Creating Learners ---');
        for (const user of learners) {
            const checkQuery = 'SELECT * FROM users WHERE email = $1';
            const checkResult = await pool.query(checkQuery, [user.email]);

            if (checkResult.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO users (name, email, password, role, created_at)
                    VALUES ($1, $2, $3, $4, NOW())
                    RETURNING id
                `;
                const res = await pool.query(insertQuery, [user.name, user.email, hashedPassword, user.role]);
                console.log(`Created learner: ${user.name} (ID: ${res.rows[0].id})`);

                // Initialize user points
                await pool.query('INSERT INTO user_points (user_id, total_points) VALUES ($1, 0) ON CONFLICT DO NOTHING', [res.rows[0].id]);
            } else {
                // Update password if user exists
                await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, user.email]);
                console.log(`Learner exists, updated password: ${user.name}`);
            }
        }

        // Create some enrollments for testing
        console.log('\n--- Creating Test Enrollments ---');
        const courseResult = await pool.query('SELECT id FROM courses LIMIT 3');
        const learnerResult = await pool.query("SELECT id FROM users WHERE role = 'LEARNER' LIMIT 3");

        if (courseResult.rows.length > 0 && learnerResult.rows.length > 0) {
            for (const learner of learnerResult.rows) {
                for (const course of courseResult.rows.slice(0, 2)) {
                    const checkEnroll = 'SELECT 1 FROM course_enrollments WHERE user_id = $1 AND course_id = $2';
                    const enrollCheck = await pool.query(checkEnroll, [learner.id, course.id]);

                    if (enrollCheck.rows.length === 0) {
                        await pool.query(`
                            INSERT INTO course_enrollments (user_id, course_id, status)
                            VALUES ($1, $2, 'ENROLLED')
                        `, [learner.id, course.id]);

                        await pool.query(`
                            INSERT INTO course_progress (user_id, course_id, status, start_date)
                            VALUES ($1, $2, 'YET_TO_START', NOW())
                            ON CONFLICT (user_id, course_id) DO NOTHING
                        `, [learner.id, course.id]);

                        console.log(`Enrolled learner ${learner.id} in course ${course.id}`);
                    }
                }
            }
        }

        console.log('\n=== Seeding Complete ===');
        console.log('\nTest Credentials:');
        console.log('- Instructor: instructor@test.com / password123');
        console.log('- Learner: learner@test.com / password123');

    } catch (error) {
        console.error('Error seeding test users:', error);
    } finally {
        await pool.end();
    }
};

seedTestUsers();
