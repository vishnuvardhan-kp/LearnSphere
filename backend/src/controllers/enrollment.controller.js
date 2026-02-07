const { pool } = require('../db');

// Enroll in a course
const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if already enrolled
        const checkQuery = 'SELECT * FROM course_enrollments WHERE user_id = $1 AND course_id = $2';
        const checkResult = await client.query(checkQuery, [userId, courseId]);

        if (checkResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Already enrolled' });
        }

        // Create enrollment
        const enrollQuery = 'INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *';
        await client.query(enrollQuery, [userId, courseId]);

        // Initialize progress
        // Use COALESCE or similar if explicit handling needed, but migration ensures column exists.
        const initProgressQuery = `
            INSERT INTO course_progress (user_id, course_id, status, completion_percentage, completed_lessons) 
            VALUES ($1, $2, 'in_progress', 0, '[]'::jsonb)
        `;
        await client.query(initProgressQuery, [userId, courseId]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

// Get My Courses (Enrolled)
const getEnrolledCourses = async (req, res) => {
    const userId = req.user.id;
    try {
        // We use COALESCE to handle either completion_percentage or overall_progress
        // We select whichever is non-null or defaults to 0
        const query = `
            SELECT c.*, 
            ce.enrolled_at,
            COALESCE(cp.completion_percentage, cp.overall_progress, 0) as progress,
            cp.status as course_status,
            u.name as author,
            (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as total_lessons
            FROM course_enrollments ce
            JOIN courses c ON ce.course_id = c.id
            LEFT JOIN users u ON c.course_admin_id = u.id
            LEFT JOIN course_progress cp ON ce.course_id = cp.course_id AND ce.user_id = cp.user_id
            WHERE ce.user_id = $1
            ORDER BY ce.enrolled_at DESC
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch enrolled error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update Progress (Complete a lesson)
const updateProgress = async (req, res) => {
    const { courseId, lessonId, status } = req.body;
    const userId = req.user.id;

    try {
        // 1. Get current progress
        const progressQuery = 'SELECT * FROM course_progress WHERE user_id = $1 AND course_id = $2';
        const progressRes = await pool.query(progressQuery, [userId, courseId]);

        let currentCompleted = [];
        let rowExists = false;

        if (progressRes.rows.length > 0) {
            rowExists = true;
            if (progressRes.rows[0].completed_lessons) {
                 currentCompleted = progressRes.rows[0].completed_lessons; 
            }
        } 

        // Add lesson if not exists
        const lIdStr = lessonId.toString();
        if (!currentCompleted.includes(lIdStr)) {
            currentCompleted.push(lIdStr);
        }

        // Calculate %
        const lessonCountRes = await pool.query('SELECT COUNT(*) FROM lessons WHERE course_id = $1', [courseId]);
        const totalLessons = parseInt(lessonCountRes.rows[0].count) || 1;
        const percentage = Math.round((currentCompleted.length / totalLessons) * 100);
        const courseStatus = percentage >= 100 ? 'completed' : 'in_progress';
        
        let updateRes;
        if (rowExists) {
             const updateQuery = `
                UPDATE course_progress 
                SET completed_lessons = $1::jsonb, 
                    completion_percentage = $2,
                    overall_progress = $2,
                    last_accessed = CURRENT_TIMESTAMP,
                    status = $3
                WHERE user_id = $4 AND course_id = $5
                RETURNING *
            `;
            updateRes = await pool.query(updateQuery, [JSON.stringify(currentCompleted), percentage, courseStatus, userId, courseId]);
        } else {
             // Fallback insert if missing for some reason
             const insertQuery = `
                INSERT INTO course_progress (user_id, course_id, completed_lessons, completion_percentage, overall_progress, status, last_accessed)
                VALUES ($1, $2, $3::jsonb, $4, $4, $5, CURRENT_TIMESTAMP)
                RETURNING *
             `;
             updateRes = await pool.query(insertQuery, [userId, courseId, JSON.stringify(currentCompleted), percentage, courseStatus]);
        }
        
        res.json(updateRes.rows[0]);

    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Course Progress
const getCourseProgress = async (req, res) => {
     const { courseId } = req.params;
     const userId = req.user.id;
     
     try {
         const result = await pool.query('SELECT * FROM course_progress WHERE user_id = $1 AND course_id = $2', [userId, courseId]);
         if (result.rows.length === 0) {
             return res.json({ completedLessons: [], completion_percentage: 0 });
         }
         
         const row = result.rows[0];
         res.json({
             completedLessons: row.completed_lessons || [],
             completion_percentage: row.completion_percentage || 0,
             status: row.status
         });
     } catch (error) {
         console.error('Get progress error:', error);
         res.status(500).json({ error: 'Internal server error' });
     }
};

module.exports = {
    enrollInCourse,
    getEnrolledCourses,
    updateProgress,
    getCourseProgress
};
