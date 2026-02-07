const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/learnsphere'
});

async function runQueries() {
    try {
        console.log('Testing connect...');
        const client = await pool.connect();
        console.log('Connected.');
        client.release();

        console.log('Testing getInstructors query...');
        const instructorsQuery = `
            SELECT 
                u.id, u.name, u.email, u.avatar_url, u.created_at,
                COUNT(DISTINCT c.id) as courses,
                COUNT(DISTINCT ce.user_id) as students,
                COALESCE(AVG(cr.rating), 0) as rating
            FROM users u
            LEFT JOIN courses c ON u.id = c.course_admin_id
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            LEFT JOIN course_reviews cr ON c.id = cr.course_id
            WHERE u.role = 'INSTRUCTOR'
            GROUP BY u.id ORDER BY u.created_at DESC
        `;
        await pool.query(instructorsQuery);
        console.log('getInstructors query SUCCESS');

        console.log('Testing listCourses query...');
        const coursesQuery = `
            SELECT c.*, 
            u.name as author,
            (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as total_lessons,
            (SELECT COALESCE(SUM(l.duration_minutes), 0) FROM lessons l WHERE l.course_id = c.id) as total_duration,
            COALESCE(AVG(r.rating), 0) as rating
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
            LEFT JOIN course_reviews r ON c.id = r.course_id
            GROUP BY c.id, u.name
            ORDER BY c.created_at DESC
        `;
        await pool.query(coursesQuery);
        console.log('listCourses query SUCCESS');

    } catch (err) {
        console.error('FAILED:', err);
    } finally {
        pool.end();
    }
}

runQueries();
