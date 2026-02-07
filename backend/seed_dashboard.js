const { pool } = require('./src/db');

async function seedDashboard() {
    try {
        console.log("--- Seeding Dashboard Data ---");

        // 1. Get Learners and Courses
        const learnersRes = await pool.query("SELECT id FROM users WHERE role = 'LEARNER'");
        const coursesRes = await pool.query("SELECT id FROM courses");

        if (learnersRes.rows.length === 0) {
            console.log("No learners found. Creating dummy learners...");
            // Create some learners
            for (let i = 1; i <= 5; i++) {
                const res = await pool.query(`
                    INSERT INTO users (name, email, password, role) 
                    VALUES ($1, $2, $3, 'LEARNER') 
                    RETURNING id`,
                    [`Learner ${i}`, `learner${i}@test.com`, 'hashedpassword']
                );
                learnersRes.rows.push(res.rows[0]);
            }
        }

        if (coursesRes.rows.length === 0) {
            console.log("No courses found. creating dummy courses...");
            for (let i = 1; i <= 3; i++) {
                const res = await pool.query(`
                    INSERT INTO courses (title, description, price, duration, level, language, category, course_admin_id) 
                    VALUES ($1, 'Desc', 100, '5h', 'Beginner', 'English', 'Tech', 1) 
                    RETURNING id`,
                    [`Course ${i}`]
                );
                coursesRes.rows.push(res.rows[0]);
            }
        }

        const learners = learnersRes.rows;
        const courses = coursesRes.rows;

        console.log(`Found ${learners.length} learners and ${courses.length} courses.`);

        // 3. Create Enrollments and Progress
        for (const learner of learners) {
            // Enroll in 1-3 random courses
            const numCourses = Math.floor(Math.random() * 3) + 1;
            const shuffledCourses = courses.sort(() => 0.5 - Math.random()).slice(0, numCourses);

            for (const course of shuffledCourses) {
                // Check if enrolled
                const check = await pool.query("SELECT id FROM course_enrollments WHERE user_id = $1 AND course_id = $2", [learner.id, course.id]);

                if (check.rowCount === 0) {
                    // Enroll
                    const enrolledAt = new Date();
                    enrolledAt.setDate(enrolledAt.getDate() - Math.floor(Math.random() * 10)); // Past 10 days

                    await pool.query(`
                        INSERT INTO course_enrollments (user_id, course_id, enrolled_at)
                        VALUES ($1, $2, $3)`,
                        [learner.id, course.id, enrolledAt]
                    );

                    // Progress
                    const status = Math.random() > 0.7 ? 'COMPLETED' : (Math.random() > 0.3 ? 'IN_PROGRESS' : 'YET_TO_START');
                    const progress = status === 'COMPLETED' ? 100 : (status === 'IN_PROGRESS' ? Math.floor(Math.random() * 90) : 0);

                    // Fixed: Removed last_accessed which doesn't exist in schema
                    await pool.query(`
                        INSERT INTO course_progress (user_id, course_id, status, completion_percentage, start_date, completed_date)
                        VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            learner.id,
                            course.id,
                            status,
                            progress,
                            enrolledAt, // start date
                            status === 'COMPLETED' ? new Date() : null // completed date
                        ]
                    );

                    console.log(`Enrolled Learner ${learner.id} in Course ${course.id} (${status})`);
                }
            }
        }

        console.log("Seeding complete!");

    } catch (err) {
        console.error("Error seeding:", err);
    } finally {
        pool.end();
    }
}

seedDashboard();
