const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const seedCourses = async () => {
    try {
        console.log('Seeding Courses (Final Attempt)...');

        // 1. Get an Instructor ID (Admin)
        const userQuery = "SELECT id FROM users WHERE role = 'ADMIN' OR role = 'INSTRUCTOR' LIMIT 1";
        const userRes = await pool.query(userQuery);

        if (userRes.rows.length === 0) {
            console.error('No Admin or Instructor found. Please run seed-admin.js first.');
            return;
        }

        const instructorId = userRes.rows[0].id;

        const courses = [
            {
                title: 'Complete React Guide',
                short_description: 'Master React from scratch',
                description: 'A comprehensive guide to building modern web apps with React.',
                price: 49.99,
                course_admin_id: instructorId,
                visibility: 'EVERYONE',
                tags: ['React', 'Frontend', 'Web Development'],
                modules: [
                    {
                        title: 'Introduction',
                        lessons: [
                            { title: 'What is React?', type: 'VIDEO', duration_minutes: 10 },
                            { title: 'Setup Environment', type: 'TEXT', duration_minutes: 15 }
                        ]
                    }
                ]
            },
            {
                title: 'Advanced Node.js',
                short_description: 'Backend mastery',
                description: 'Deep dive into Node.js architecture and performance.',
                price: 59.99,
                course_admin_id: instructorId,
                visibility: 'EVERYONE',
                tags: ['Node.js', 'Backend', 'JavaScript'],
                modules: [
                    {
                        title: 'Event Loop',
                        lessons: [
                            { title: 'Understanding Event Loop', type: 'VIDEO', duration_minutes: 20 }
                        ]
                    }
                ]
            },
            {
                title: 'Python for Data Science',
                short_description: 'Data analysis with Python',
                description: 'Learn Pandas, NumPy, and Matplotlib.',
                price: 39.99,
                course_admin_id: instructorId,
                visibility: 'EVERYONE',
                tags: ['Python', 'Data Science'],
                modules: []
            }
        ];

        // Cleanup existing (optional check, better to just check internally)

        for (const course of courses) {
            // Check if course exists
            const checkQuery = 'SELECT id FROM courses WHERE title = $1';
            const checkRes = await pool.query(checkQuery, [course.title]);

            if (checkRes.rows.length === 0) {
                // Insert Course
                const courseInsert = `
                    INSERT INTO courses (title, short_description, description, price, course_admin_id, visibility, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    RETURNING id
                `;
                const courseRes = await pool.query(courseInsert, [
                    course.title, course.short_description, course.description,
                    course.price, course.course_admin_id, course.visibility
                ]);
                const courseId = courseRes.rows[0].id;
                console.log(`Created course: ${course.title} (ID: ${courseId})`);

                // Insert Tags
                for (const tag of course.tags) {
                    await pool.query('INSERT INTO course_tags (course_id, tag) VALUES ($1, $2)', [courseId, tag]);
                }

                // Insert Modules & Lessons
                let lessonOrder = 1;
                for (const module of course.modules) {
                    for (const lesson of module.lessons) {
                        const lessonInsert = `
                            INSERT INTO lessons (course_id, title, type, content_url, duration_minutes, allow_download, lesson_order, module_title)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        `;
                        // Now schema has module_title!
                        await pool.query(lessonInsert, [
                            courseId,
                            lesson.title,
                            lesson.type,
                            '', // content_url default
                            lesson.duration_minutes,
                            false, // allow_download default
                            lessonOrder++,
                            module.title
                        ]);
                    }
                }
            } else {
                console.log(`Course already exists: ${course.title}`);
            }
        }

        console.log('Seeding courses completed successfully.');

    } catch (error) {
        console.error('Error seeding courses:', error);
    } finally {
        await pool.end();
    }
};

seedCourses();
