const { pool } = require('./src/db');

async function debugUsers() {
    try {
        console.log("Checking Users...");
        const usersRes = await pool.query("SELECT id, name, email, role FROM users WHERE role = 'LEARNER'");
        console.log(`Found ${usersRes.rows.length} LEARNERs:`);
        console.table(usersRes.rows);

        console.log("\nChecking Enrollments...");
        const enrollRes = await pool.query("SELECT * FROM course_enrollments");
        console.log(`Found ${enrollRes.rows.length} Enrollments.`);

        console.log("\nTesting getLearners Query...");
        const learnerQuery = `
            SELECT 
                u.id, u.name, u.email, 
                COUNT(DISTINCT ce.course_id) as enrolled_courses
            FROM users u
            LEFT JOIN course_enrollments ce ON u.id = ce.user_id
            WHERE u.role = 'LEARNER'
            GROUP BY u.id
        `;
        const learnerRes = await pool.query(learnerQuery);
        console.log(`getLearners returned ${learnerRes.rows.length} rows.`);
        console.table(learnerRes.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

debugUsers();
