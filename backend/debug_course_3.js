const { pool } = require('./src/db');

async function debugCourse3() {
    try {
        console.log("Checking Course 3...");
        const courseRes = await pool.query('SELECT * FROM courses WHERE id = 3');
        if (courseRes.rows.length === 0) {
            console.log("Course 3 NOT FOUND");
        } else {
            console.log("Course 3 Found:", courseRes.rows[0]);
        }

        const lessonsRes = await pool.query('SELECT * FROM lessons WHERE course_id = 3');
        console.log(`Lessons for Course 3: ${lessonsRes.rows.length}`);
        console.log(lessonsRes.rows);

        const allLessons = await pool.query('SELECT id, course_id, title FROM lessons');
        console.log("All Lessons:", allLessons.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

debugCourse3();
