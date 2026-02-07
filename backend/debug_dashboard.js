const { pool } = require('./src/db');

async function debugDashboard() {
    try {
        console.log("--- Debugging Dashboard Data ---");

        // 1. Check Recent Activity Query
        console.log("\n1. Recent Activity:");
        const activityQuery = `
            SELECT u.name as user, 'enrollment' as type, c.title as course, ce.enrolled_at as time
            FROM course_enrollments ce
            JOIN users u ON ce.user_id = u.id
            JOIN courses c ON ce.course_id = c.id
            ORDER BY ce.enrolled_at DESC
            LIMIT 5
        `;
        const activityRes = await pool.query(activityQuery);
        console.table(activityRes.rows);

        // 2. Check Graph Data (Enrollments)
        console.log("\n2. Graph Data (Enrollments):");
        const enrollmentQuery = `
            SELECT to_char(d, 'Dy') as day_name, COUNT(ce.id) as count
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') as d
            LEFT JOIN course_enrollments ce ON DATE(ce.enrolled_at) = d
            GROUP BY d
            ORDER BY d
        `;
        const graphRes = await pool.query(enrollmentQuery);
        console.table(graphRes.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

debugDashboard();
