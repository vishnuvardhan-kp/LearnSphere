const { pool } = require('./src/db');

async function debugFull() {
    try {
        console.log("=== Debugging DB Content ===");

        // 1. Users
        const users = await pool.query("SELECT id, role, email FROM users");
        console.log(`Users (${users.rowCount}):`, users.rows);

        // 2. Courses
        const courses = await pool.query("SELECT id, title, course_admin_id FROM courses");
        console.log(`Courses (${courses.rowCount}):`, courses.rows);

        // 3. Course Tags
        const tags = await pool.query("SELECT * FROM course_tags");
        console.log(`Tags (${tags.rowCount}):`, tags.rows);

        // 4. Enrollments
        const enrollments = await pool.query("SELECT * FROM course_enrollments");
        console.log(`Enrollments (${enrollments.rowCount}):`, enrollments.rows);

        // 5. Course Progress
        const progress = await pool.query("SELECT * FROM course_progress");
        console.log(`Progress (${progress.rowCount}):`, progress.rows);

    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        pool.end();
    }
}

debugFull();
