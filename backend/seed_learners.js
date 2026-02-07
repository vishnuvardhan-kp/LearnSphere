const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const seedLearners = async () => {
    try {
        console.log('Seeding Learners...');

        const learners = [
            { name: 'John Doe', email: 'john@example.com', role: 'LEARNER' },
            { name: 'Jane Smith', email: 'jane@example.com', role: 'LEARNER' },
            { name: 'Mike Johnson', email: 'mike@example.com', role: 'LEARNER' },
            { name: 'Emily Davis', email: 'emily@example.com', role: 'LEARNER' },
            { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'LEARNER' }
        ];

        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        for (const learner of learners) {
            const checkQuery = 'SELECT * FROM users WHERE email = $1';
            const checkResult = await pool.query(checkQuery, [learner.email]);

            if (checkResult.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO users (name, email, password, role, created_at)
                    VALUES ($1, $2, $3, $4, NOW())
                    RETURNING id
                `;
                const res = await pool.query(insertQuery, [learner.name, learner.email, hashedPassword, learner.role]);
                console.log(`Created learner: ${learner.name} (ID: ${res.rows[0].id})`);
            } else {
                console.log(`Learner already exists: ${learner.name}`);
            }
        }

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding learners:', error);
    } finally {
        await pool.end();
    }
};

seedLearners();
