const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

// Learner Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(userQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        if (user.role !== 'LEARNER') {
            return res.status(403).json({ error: 'Access denied. Only Learners can log in here.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Learner login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Learner Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT id, name, email, role, avatar_url, created_at
            FROM users WHERE id = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Get learner stats
        const statsQuery = `
            SELECT
                COUNT(DISTINCT ce.course_id) as enrolled_courses,
                (SELECT COUNT(*) FROM course_progress cp WHERE cp.user_id = $1 AND cp.status = 'COMPLETED') as completed_courses,
                COALESCE((SELECT total_points FROM user_points WHERE user_id = $1), 0) as points
            FROM course_enrollments ce
            WHERE ce.user_id = $1
        `;
        const statsResult = await pool.query(statsQuery, [userId]);
        const stats = statsResult.rows[0];

        // Get badges
        const badgesQuery = `
            SELECT b.name FROM badges b
            INNER JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = $1
        `;
        const badgesResult = await pool.query(badgesQuery, [userId]);
        const badges = badgesResult.rows.map(r => r.name);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url,
            points: parseInt(stats.points) || 0,
            badges: badges.length > 0 ? badges : ['Newbie'],
            enrolledCourses: parseInt(stats.enrolled_courses) || 0,
            completedCourses: parseInt(stats.completed_courses) || 0
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// List Available Courses for Learner
const listCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { search } = req.query;

        let query = `
            SELECT
                c.id,
                c.title,
                c.short_description as description,
                c.description as full_description,
                c.image_url as image,
                u.name as instructor,
                (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as "totalLessons",
                (SELECT COALESCE(SUM(l.duration_minutes), 0) FROM lessons l WHERE l.course_id = c.id) as total_duration,
                (SELECT array_agg(ct.tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags,
                COALESCE((SELECT AVG(cr.rating) FROM course_reviews cr WHERE cr.course_id = c.id), 0) as rating,
                (SELECT COUNT(*) FROM course_reviews cr WHERE cr.course_id = c.id) as review_count,
                100 as "totalPoints"
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
            WHERE c.is_published = true
        `;

        const params = [];

        if (search) {
            query += ` AND (c.title ILIKE $1 OR EXISTS (SELECT 1 FROM course_tags ct WHERE ct.course_id = c.id AND ct.tag ILIKE $1))`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY c.created_at DESC`;

        const result = await pool.query(query, params);

        // Format response for frontend
        const courses = result.rows.map(c => ({
            id: c.id.toString(),
            title: c.title,
            description: c.description || c.full_description || '',
            image: c.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            tags: c.tags ? c.tags.filter(t => t !== null) : [],
            totalLessons: parseInt(c.totalLessons) || 0,
            totalDuration: `${c.total_duration || 0}m`,
            instructor: c.instructor || 'Unknown',
            rating: parseFloat(c.rating) || 0,
            reviewCount: parseInt(c.review_count) || 0,
            totalPoints: parseInt(c.totalPoints) || 100
        }));

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Course Detail with Lessons
const getCourseDetail = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        // Course Details - MUST check is_published for learners
        const courseQuery = `
            SELECT
                c.id,
                c.title,
                c.short_description as description,
                c.description as full_description,
                c.image_url as image,
                c.is_published,
                u.name as instructor,
                u.avatar_url as instructor_avatar,
                (SELECT array_agg(ct.tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags,
                100 as "totalPoints"
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
            WHERE c.id = $1
        `;
        const courseResult = await pool.query(courseQuery, [id]);

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const course = courseResult.rows[0];

        // IMPORTANT: Learners can only access published courses
        if (!course.is_published) {
            return res.status(403).json({
                error: 'Course not available',
                message: 'This course is not yet published'
            });
        }

        // Get Lessons with progress if user is logged in
        let lessonsQuery = `
            SELECT
                l.id,
                l.title,
                LOWER(l.type) as type,
                l.content_url as url,
                l.duration_minutes,
                CONCAT(l.duration_minutes, ':00') as duration,
                l.lesson_order
        `;

        if (userId) {
            lessonsQuery += `,
                COALESCE(lp.is_completed, false) as "isCompleted"
            FROM lessons l
            LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $2
            WHERE l.course_id = $1
            ORDER BY l.lesson_order
            `;
        } else {
            lessonsQuery += `,
                false as "isCompleted"
            FROM lessons l
            WHERE l.course_id = $1
            ORDER BY l.lesson_order
            `;
        }

        const lessonsResult = await pool.query(lessonsQuery, userId ? [id, userId] : [id]);

        // Get Reviews
        const reviewsQuery = `
            SELECT
                cr.id,
                u.name as "userName",
                u.avatar_url as avatar,
                cr.rating,
                cr.review_text as comment,
                TO_CHAR(cr.created_at, 'YYYY-MM-DD') as date
            FROM course_reviews cr
            JOIN users u ON cr.user_id = u.id
            WHERE cr.course_id = $1
            ORDER BY cr.created_at DESC
        `;
        const reviewsResult = await pool.query(reviewsQuery, [id]);

        // Check if user is enrolled
        let isEnrolled = false;
        if (userId) {
            const enrollmentQuery = 'SELECT 1 FROM course_enrollments WHERE user_id = $1 AND course_id = $2';
            const enrollmentResult = await pool.query(enrollmentQuery, [userId, id]);
            isEnrolled = enrollmentResult.rows.length > 0;
        }

        res.json({
            id: course.id.toString(),
            title: course.title,
            description: course.description || course.full_description || '',
            image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            tags: course.tags ? course.tags.filter(t => t !== null) : [],
            totalPoints: course.totalPoints,
            instructor: {
                name: course.instructor || 'Unknown',
                avatar: course.instructor_avatar
            },
            lessons: lessonsResult.rows.map(l => ({
                id: l.id.toString(),
                title: l.title,
                type: l.type,
                url: l.url,
                duration: l.duration || `${l.duration_minutes}:00`,
                isCompleted: l.isCompleted
            })),
            reviews: reviewsResult.rows.map(r => ({
                id: r.id.toString(),
                userName: r.userName,
                avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName)}`,
                rating: r.rating,
                comment: r.comment,
                date: r.date
            })),
            isEnrolled
        });
    } catch (error) {
        console.error('Error fetching course detail:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Enroll in Course
const enrollCourse = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        // First verify course exists and is published
        const courseCheck = await pool.query(
            'SELECT is_published FROM courses WHERE id = $1',
            [courseId]
        );

        if (courseCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (!courseCheck.rows[0].is_published) {
            return res.status(403).json({
                error: 'Cannot enroll',
                message: 'This course is not yet available for enrollment'
            });
        }

        // Check if already enrolled
        const checkQuery = 'SELECT 1 FROM course_enrollments WHERE user_id = $1 AND course_id = $2';
        const checkResult = await pool.query(checkQuery, [userId, courseId]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        // Enroll user
        const enrollQuery = `
            INSERT INTO course_enrollments (user_id, course_id, status)
            VALUES ($1, $2, 'ENROLLED')
            RETURNING id
        `;
        await pool.query(enrollQuery, [userId, courseId]);

        // Initialize course progress
        const progressQuery = `
            INSERT INTO course_progress (user_id, course_id, status, start_date)
            VALUES ($1, $2, 'YET_TO_START', CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, course_id) DO NOTHING
        `;
        await pool.query(progressQuery, [userId, courseId]);

        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Enrolled Courses
const getEnrolledCourses = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT
                c.id,
                c.title,
                c.short_description as description,
                c.image_url as image,
                u.name as instructor,
                (SELECT array_agg(ct.tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags,
                COALESCE(cp.completion_percentage, 0) as progress,
                cp.status
            FROM course_enrollments ce
            JOIN courses c ON ce.course_id = c.id
            LEFT JOIN users u ON c.course_admin_id = u.id
            LEFT JOIN course_progress cp ON ce.user_id = cp.user_id AND ce.course_id = cp.course_id
            WHERE ce.user_id = $1
            ORDER BY ce.enrolled_at DESC
        `;

        const result = await pool.query(query, [userId]);

        const courses = result.rows.map(c => ({
            id: c.id.toString(),
            title: c.title,
            description: c.description || '',
            image: c.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            tags: c.tags ? c.tags.filter(t => t !== null) : [],
            instructor: c.instructor || 'Unknown',
            progress: parseFloat(c.progress) || 0,
            status: c.status || 'YET_TO_START'
        }));

        res.json(courses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark Lesson as Complete
const completeLessonProgress = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;
    const { timeSpent } = req.body;

    try {
        // Upsert lesson progress
        const lessonProgressQuery = `
            INSERT INTO lesson_progress (user_id, lesson_id, is_completed, time_spent_minutes, completed_at)
            VALUES ($1, $2, true, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, lesson_id)
            DO UPDATE SET is_completed = true, time_spent_minutes = COALESCE(lesson_progress.time_spent_minutes, 0) + $3, completed_at = CURRENT_TIMESTAMP
            RETURNING id
        `;
        await pool.query(lessonProgressQuery, [userId, lessonId, timeSpent || 0]);

        // Update course progress
        const totalLessonsQuery = 'SELECT COUNT(*) as total FROM lessons WHERE course_id = $1';
        const totalResult = await pool.query(totalLessonsQuery, [courseId]);
        const totalLessons = parseInt(totalResult.rows[0].total);

        const completedLessonsQuery = `
            SELECT COUNT(*) as completed
            FROM lesson_progress lp
            JOIN lessons l ON lp.lesson_id = l.id
            WHERE l.course_id = $1 AND lp.user_id = $2 AND lp.is_completed = true
        `;
        const completedResult = await pool.query(completedLessonsQuery, [courseId, userId]);
        const completedLessons = parseInt(completedResult.rows[0].completed);

        const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        const status = completionPercentage >= 100 ? 'COMPLETED' : (completionPercentage > 0 ? 'IN_PROGRESS' : 'YET_TO_START');

        const updateProgressQuery = `
            INSERT INTO course_progress (user_id, course_id, completion_percentage, status, start_date, completed_date)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
            ON CONFLICT (user_id, course_id)
            DO UPDATE SET
                completion_percentage = $3,
                status = $4,
                completed_date = $5
        `;
        const completedDate = status === 'COMPLETED' ? 'CURRENT_TIMESTAMP' : null;
        await pool.query(updateProgressQuery, [userId, courseId, completionPercentage, status, completedDate]);

        // Update enrollment status
        const enrollmentStatus = status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS';
        await pool.query('UPDATE course_enrollments SET status = $1 WHERE user_id = $2 AND course_id = $3', [enrollmentStatus, userId, courseId]);

        res.json({
            message: 'Progress updated',
            completionPercentage,
            status
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Lesson Content
const getLessonContent = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const userId = req.user?.id;

    try {
        // First check if course is published (learner protection)
        const courseCheck = await pool.query(
            'SELECT is_published FROM courses WHERE id = $1',
            [courseId]
        );

        if (courseCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (!courseCheck.rows[0].is_published) {
            return res.status(403).json({
                error: 'Course not available',
                message: 'This course is not yet published'
            });
        }

        const query = `
            SELECT
                l.id,
                l.title,
                LOWER(l.type) as type,
                l.content_url as url,
                l.duration_minutes,
                CONCAT(l.duration_minutes, ':00') as duration,
                q.id as quiz_id
            FROM lessons l
            LEFT JOIN quizzes q ON l.quiz_id = q.id
            WHERE l.id = $1 AND l.course_id = $2
        `;

        const result = await pool.query(query, [lessonId, courseId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const lesson = result.rows[0];

        // If it's a quiz, get questions
        if (lesson.type === 'quiz' && lesson.quiz_id) {
            const questionsQuery = `
                SELECT
                    qq.id,
                    qq.question_text as text
                FROM quiz_questions qq
                WHERE qq.quiz_id = $1
                ORDER BY qq.id
            `;
            const questionsResult = await pool.query(questionsQuery, [lesson.quiz_id]);

            const questions = [];
            for (const q of questionsResult.rows) {
                const optionsQuery = `
                    SELECT id, option_text, is_correct
                    FROM quiz_options
                    WHERE question_id = $1
                    ORDER BY id
                `;
                const optionsResult = await pool.query(optionsQuery, [q.id]);

                questions.push({
                    id: q.id.toString(),
                    text: q.text,
                    options: optionsResult.rows.map(o => o.option_text),
                    correctOption: optionsResult.rows.findIndex(o => o.is_correct)
                });
            }

            // Get rewards
            const rewardsQuery = 'SELECT attempt_number, points FROM quiz_rewards WHERE quiz_id = $1 ORDER BY attempt_number';
            const rewardsResult = await pool.query(rewardsQuery, [lesson.quiz_id]);

            const rewards = {
                first: rewardsResult.rows.find(r => r.attempt_number === 1)?.points || 50,
                second: rewardsResult.rows.find(r => r.attempt_number === 2)?.points || 30,
                third: rewardsResult.rows.find(r => r.attempt_number === 3)?.points || 20,
                fourthPlus: rewardsResult.rows.find(r => r.attempt_number >= 4)?.points || 10
            };

            lesson.quizConfig = { questions, rewards };
        }

        // Check completion status
        let isCompleted = false;
        if (userId) {
            const progressQuery = 'SELECT is_completed FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2';
            const progressResult = await pool.query(progressQuery, [userId, lessonId]);
            isCompleted = progressResult.rows.length > 0 && progressResult.rows[0].is_completed;
        }

        res.json({
            id: lesson.id.toString(),
            title: lesson.title,
            type: lesson.type,
            url: lesson.url,
            duration: lesson.duration,
            isCompleted,
            quizConfig: lesson.quizConfig || null
        });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Submit Quiz
const submitQuiz = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;
    const { answers, score } = req.body;

    try {
        // Get quiz id from lesson
        const lessonQuery = 'SELECT quiz_id FROM lessons WHERE id = $1';
        const lessonResult = await pool.query(lessonQuery, [lessonId]);

        if (lessonResult.rows.length === 0 || !lessonResult.rows[0].quiz_id) {
            return res.status(400).json({ error: 'No quiz associated with this lesson' });
        }

        const quizId = lessonResult.rows[0].quiz_id;

        // Get attempt number
        const attemptQuery = 'SELECT MAX(attempt_number) as max_attempt FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2';
        const attemptResult = await pool.query(attemptQuery, [userId, quizId]);
        const attemptNumber = (attemptResult.rows[0].max_attempt || 0) + 1;

        // Record attempt
        const insertAttemptQuery = `
            INSERT INTO quiz_attempts (user_id, quiz_id, attempt_number, score)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const attemptInsertResult = await pool.query(insertAttemptQuery, [userId, quizId, attemptNumber, score]);
        const attemptId = attemptInsertResult.rows[0].id;

        // Record answers
        if (answers && Array.isArray(answers)) {
            for (const answer of answers) {
                const answerQuery = `
                    INSERT INTO quiz_answers (attempt_id, question_id, option_id, is_correct)
                    VALUES ($1, $2, $3, $4)
                `;
                await pool.query(answerQuery, [attemptId, answer.questionId, answer.optionId, answer.isCorrect]);
            }
        }

        // Award points based on attempt
        const rewardQuery = 'SELECT points FROM quiz_rewards WHERE quiz_id = $1 AND attempt_number = $2';
        let rewardResult = await pool.query(rewardQuery, [quizId, Math.min(attemptNumber, 4)]);

        let pointsEarned = 10; // Default
        if (rewardResult.rows.length > 0) {
            pointsEarned = rewardResult.rows[0].points;
        } else {
            // Use default rewards based on attempt
            if (attemptNumber === 1) pointsEarned = 50;
            else if (attemptNumber === 2) pointsEarned = 30;
            else if (attemptNumber === 3) pointsEarned = 20;
            else pointsEarned = 10;
        }

        // Update user points
        const updatePointsQuery = `
            INSERT INTO user_points (user_id, total_points)
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET total_points = user_points.total_points + $2
        `;
        await pool.query(updatePointsQuery, [userId, pointsEarned]);

        res.json({
            message: 'Quiz submitted',
            attemptNumber,
            score,
            pointsEarned
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Submit Review
const submitReview = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    try {
        // Check if user is enrolled
        const enrollCheck = 'SELECT 1 FROM course_enrollments WHERE user_id = $1 AND course_id = $2';
        const enrollResult = await pool.query(enrollCheck, [userId, courseId]);

        if (enrollResult.rows.length === 0) {
            return res.status(403).json({ error: 'Must be enrolled to review this course' });
        }

        // Upsert review
        const reviewQuery = `
            INSERT INTO course_reviews (user_id, course_id, rating, review_text)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, course_id)
            DO UPDATE SET rating = $3, review_text = $4, created_at = CURRENT_TIMESTAMP
            RETURNING id
        `;
        const result = await pool.query(reviewQuery, [userId, courseId, rating, comment]);

        res.json({ message: 'Review submitted', id: result.rows[0].id });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get User Points and Badges
const getUserStats = async (req, res) => {
    const userId = req.user.id;

    try {
        // Get points
        const pointsQuery = 'SELECT COALESCE(total_points, 0) as points FROM user_points WHERE user_id = $1';
        const pointsResult = await pool.query(pointsQuery, [userId]);
        const points = pointsResult.rows.length > 0 ? pointsResult.rows[0].points : 0;

        // Get badges
        const badgesQuery = `
            SELECT b.name, b.min_points, ub.earned_at
            FROM badges b
            INNER JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = $1
        `;
        const badgesResult = await pool.query(badgesQuery, [userId]);

        // Get enrolled courses count
        const enrolledQuery = 'SELECT COUNT(*) as count FROM course_enrollments WHERE user_id = $1';
        const enrolledResult = await pool.query(enrolledQuery, [userId]);

        res.json({
            points,
            badges: badgesResult.rows.map(b => b.name),
            enrolledCourses: parseInt(enrolledResult.rows[0].count) || 0
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login,
    getProfile,
    listCourses,
    getCourseDetail,
    enrollCourse,
    getEnrolledCourses,
    completeLessonProgress,
    getLessonContent,
    submitQuiz,
    submitReview,
    getUserStats
};
