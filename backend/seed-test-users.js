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

        // Create test instructors
        const instructors = [
            { name: 'John Instructor', email: 'instructor1@example.com' },
            { name: 'Jane Teacher', email: 'instructor2@example.com' }
        ];

        console.log('Creating Instructors...');
        for (const instructor of instructors) {
            const checkQuery = 'SELECT * FROM users WHERE email = $1';
            const checkResult = await pool.query(checkQuery, [instructor.email]);

            if (checkResult.rows.length > 0) {
                console.log(`  ⚠️  ${instructor.email} already exists, skipping...`);
            } else {
                const insertQuery = `
                    INSERT INTO users (name, email, password_hash, role)
                    VALUES ($1, $2, $3, 'instructor')
                    RETURNING id, name, email, role
                `;
                const result = await pool.query(insertQuery, [instructor.name, instructor.email, hashedPassword]);
                console.log(`  ✅ Created: ${result.rows[0].name} (${result.rows[0].email})`);
            }
        }

        // Create test learners
        const learners = [
            { name: 'Alice Student', email: 'learner1@example.com' },
            { name: 'Bob Learner', email: 'learner2@example.com' },
            { name: 'Charlie Student', email: 'learner3@example.com' }
        ];

        console.log('\nCreating Learners...');
        for (const learner of learners) {
            const checkQuery = 'SELECT * FROM users WHERE email = $1';
            const checkResult = await pool.query(checkQuery, [learner.email]);

            if (checkResult.rows.length > 0) {
                console.log(`  ⚠️  ${learner.email} already exists, skipping...`);
            } else {
                const insertQuery = `
                    INSERT INTO users (name, email, password_hash, role)
                    VALUES ($1, $2, $3, 'learner')
                    RETURNING id, name, email, role
                `;
                const result = await pool.query(insertQuery, [learner.name, learner.email, hashedPassword]);
                
                // Initialize user points
                await pool.query('INSERT INTO user_points (user_id, total_points) VALUES ($1, 0)', [result.rows[0].id]);
                
                console.log(`  ✅ Created: ${result.rows[0].name} (${result.rows[0].email})`);
            }
        }

        console.log('\n=== Test Users Created Successfully ===');
        console.log('Default password for all test users: password123');

    } catch (error) {
        console.error('Error seeding test users:', error);
    } finally {
        await pool.end();
    }
};

seedTestUsers();
