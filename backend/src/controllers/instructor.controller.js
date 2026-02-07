const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

// Instructor Login
const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(userQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Check role - instructor login should be for INSTRUCTOR role
        // Frontend sends 'influencer' for instructor role
        if (role === 'influencer' && user.role !== 'INSTRUCTOR') {
            return res.status(403).json({ error: 'Access denied. Only Instructors can log in here.' });
        }

        // For 'company' role (which is Learner in this frontend)
        if (role === 'company' && user.role !== 'LEARNER') {
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
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Instructor Profile
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

        // Get instructor stats
        const statsQuery = `
            SELECT
                COUNT(DISTINCT c.id) as courses_count,
                COUNT(DISTINCT ce.user_id) as students_count
            FROM courses c
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            WHERE c.course_admin_id = $1
        `;
        const statsResult = await pool.query(statsQuery, [userId]);
        const stats = statsResult.rows[0];

        res.json({
            _id: user.id,
            email: user.email,
            role: user.role === 'INSTRUCTOR' ? 'influencer' : 'company',
            name: user.name,
            isOnboarded: true,
            avatar_url: user.avatar_url,
            stats: {
                courses: parseInt(stats.courses_count) || 0,
                students: parseInt(stats.students_count) || 0
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// List Courses for Instructor (all courses, filtered by author on frontend)
const listCourses = async (req, res) => {
    try {
        const query = `
            SELECT
                c.id,
                c.title,
                c.short_description as description,
                c.image_url as image,
                c.is_published,
                u.name as author,
                CASE WHEN c.is_published THEN 'published' ELSE 'draft' END as status,
                (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as "totalLessons",
                (SELECT COALESCE(SUM(l.duration_minutes), 0) FROM lessons l WHERE l.course_id = c.id) as duration_minutes,
                (SELECT COUNT(DISTINCT ce.user_id) FROM course_enrollments ce WHERE ce.course_id = c.id) as views,
                (SELECT array_agg(ct.tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
            ORDER BY c.created_at DESC
        `;

        const result = await pool.query(query);

        // Format response for frontend
        const courses = result.rows.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            image: c.image || '',
            author: c.author || 'Unknown',
            status: c.status,
            totalLessons: parseInt(c.totalLessons) || 0,
            duration: `${c.duration_minutes || 0}m`,
            views: parseInt(c.views) || 0,
            tags: c.tags ? c.tags.filter(t => t !== null) : []
        }));

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create Course (Instructor)
const createCourse = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            title,
            description,
            author,
            duration,
            tags,
            modules,
            image
        } = req.body;

        // Find instructor by name or use logged in user
        let courseAdminId = req.user?.id;
        if (author && !courseAdminId) {
            const userQuery = 'SELECT id FROM users WHERE name = $1 AND role = $2';
            const userResult = await pool.query(userQuery, [author, 'INSTRUCTOR']);
            if (userResult.rows.length > 0) {
                courseAdminId = userResult.rows[0].id;
            }
        }

        // Parse tags and modules if they are strings
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : (tags || []);
        const parsedModules = typeof modules === 'string' ? JSON.parse(modules) : (modules || []);

        // Insert Course
        const courseQuery = `
            INSERT INTO courses (title, short_description, description, image_url, course_admin_id, is_published)
            VALUES ($1, $2, $2, $3, $4, false)
            RETURNING id
        `;
        const courseResult = await client.query(courseQuery, [
            title,
            description || '',
            image || '',
            courseAdminId
        ]);
        const courseId = courseResult.rows[0].id;

        // Insert Tags
        if (parsedTags.length > 0) {
            for (const tag of parsedTags) {
                if (tag) {
                    await client.query('INSERT INTO course_tags (course_id, tag) VALUES ($1, $2)', [courseId, tag]);
                }
            }
        }

        // Insert Lessons from Modules
        if (parsedModules.length > 0) {
            let lessonOrder = 1;
            for (const lesson of parsedModules) {
                const lessonQuery = `
                    INSERT INTO lessons (course_id, title, type, content_url, duration_minutes, lesson_order)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                await client.query(lessonQuery, [
                    courseId,
                    lesson.title || 'Untitled Lesson',
                    (lesson.type || 'VIDEO').toUpperCase(),
                    lesson.url || lesson.content_url || '',
                    lesson.duration_minutes || 0,
                    lessonOrder++
                ]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ id: courseId, message: 'Course created successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

// Update Course (Instructor)
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            title,
            description,
            tags,
            duration,
            status,
            modules,
            image
        } = req.body;

        // Parse tags and modules if they are strings
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : (tags || []);
        const parsedModules = typeof modules === 'string' ? JSON.parse(modules) : (modules || []);

        // Update Course
        const courseQuery = `
            UPDATE courses
            SET title = $1, short_description = $2, description = $2, image_url = $3,
                is_published = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        const isPublished = status === 'published';
        const result = await client.query(courseQuery, [
            title,
            description || '',
            image || '',
            isPublished,
            id
        ]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Course not found' });
        }

        // Update Tags - Delete old, insert new
        await client.query('DELETE FROM course_tags WHERE course_id = $1', [id]);
        if (parsedTags.length > 0) {
            for (const tag of parsedTags) {
                if (tag) {
                    await client.query('INSERT INTO course_tags (course_id, tag) VALUES ($1, $2)', [id, tag]);
                }
            }
        }

        // Update Lessons - Delete old, insert new
        await client.query('DELETE FROM lessons WHERE course_id = $1', [id]);
        if (parsedModules.length > 0) {
            let lessonOrder = 1;
            for (const lesson of parsedModules) {
                const lessonQuery = `
                    INSERT INTO lessons (course_id, title, type, content_url, duration_minutes, lesson_order)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                await client.query(lessonQuery, [
                    id,
                    lesson.title || 'Untitled Lesson',
                    (lesson.type || 'VIDEO').toUpperCase(),
                    lesson.url || lesson.content_url || '',
                    lesson.duration_minutes || 0,
                    lessonOrder++
                ]);
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

// Get Participants (Learners) for Instructor Reporting
const getParticipants = async (req, res) => {
    try {
        const instructorId = req.user?.id;

        // Use subquery to get unique users with aggregated progress
        let query = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.avatar_url,
                u.created_at,
                CASE
                    WHEN MAX(CASE WHEN cp.status = 'COMPLETED' THEN 1 ELSE 0 END) = 1 THEN 'completed'
                    WHEN MAX(CASE WHEN cp.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) = 1 THEN 'active'
                    ELSE 'pending'
                END as status,
                COALESCE(ROUND(AVG(cp.completion_percentage), 0), 0) as progress,
                COUNT(DISTINCT ce.course_id) as enrolled_courses
            FROM users u
            INNER JOIN course_enrollments ce ON u.id = ce.user_id
            INNER JOIN courses c ON ce.course_id = c.id
            LEFT JOIN course_progress cp ON u.id = cp.user_id AND ce.course_id = cp.course_id
            WHERE u.role = 'LEARNER'
        `;

        const params = [];

        // If instructor is logged in, filter by their courses
        if (instructorId) {
            query += ` AND c.course_admin_id = $1`;
            params.push(instructorId);
        }

        query += ` GROUP BY u.id, u.name, u.email, u.avatar_url, u.created_at`;
        query += ` ORDER BY u.created_at DESC`;

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Single Course Details (for Instructor - can see draft content)
const getCourse = async (req, res) => {
    const { id } = req.params;
    const instructorId = req.user?.id;

    try {
        const courseQuery = `
            SELECT
                c.*,
                u.name as author,
                c.is_published,
                CASE WHEN c.is_published THEN 'published' ELSE 'draft' END as status
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
            WHERE c.id = $1
        `;
        const courseResult = await pool.query(courseQuery, [id]);

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const course = courseResult.rows[0];

        // Verify instructor owns this course (if instructor is logged in)
        if (instructorId && course.course_admin_id !== instructorId) {
            // Allow viewing but mark as not owner
            course.isOwner = false;
        } else {
            course.isOwner = true;
        }

        // Get Tags
        const tagsResult = await pool.query('SELECT tag FROM course_tags WHERE course_id = $1', [id]);
        course.tags = tagsResult.rows.map(r => r.tag);

        // Get Lessons with full content for instructor preview
        const lessonsResult = await pool.query(`
            SELECT
                id,
                title,
                LOWER(type) as type,
                content_url as url,
                duration_minutes,
                CONCAT(duration_minutes, ':00') as duration,
                lesson_order,
                allow_download
            FROM lessons
            WHERE course_id = $1
            ORDER BY lesson_order
        `, [id]);

        course.lessons = lessonsResult.rows.map(l => ({
            id: l.id.toString(),
            title: l.title,
            type: l.type,
            url: l.url,
            duration: l.duration,
            duration_minutes: l.duration_minutes,
            lesson_order: l.lesson_order,
            allow_download: l.allow_download
        }));

        // Format response with explicit publish state
        res.json({
            id: course.id,
            title: course.title,
            description: course.short_description || course.description || '',
            image: course.image_url || '',
            author: course.author || 'Unknown',
            status: course.status,
            is_published: course.is_published,
            isOwner: course.isOwner,
            tags: course.tags || [],
            lessons: course.lessons,
            totalLessons: course.lessons.length,
            created_at: course.created_at,
            updated_at: course.updated_at
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Preview Course (Instructor only - shows draft content as learner would see it)
const previewCourse = async (req, res) => {
    const { id } = req.params;
    const instructorId = req.user?.id;

    try {
        // Get course details
        const courseQuery = `
            SELECT
                c.id,
                c.title,
                c.short_description as description,
                c.description as full_description,
                c.image_url as image,
                c.is_published,
                c.course_admin_id,
                u.name as instructor,
                u.avatar_url as instructor_avatar,
                (SELECT array_agg(ct.tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
            WHERE c.id = $1
        `;
        const courseResult = await pool.query(courseQuery, [id]);

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const course = courseResult.rows[0];

        // Verify instructor owns this course
        if (course.course_admin_id !== instructorId) {
            return res.status(403).json({ error: 'You can only preview your own courses' });
        }

        // Get Lessons (show all for preview, even if course is draft)
        const lessonsQuery = `
            SELECT
                l.id,
                l.title,
                LOWER(l.type) as type,
                l.content_url as url,
                l.duration_minutes,
                CONCAT(l.duration_minutes, ':00') as duration,
                l.lesson_order
            FROM lessons l
            WHERE l.course_id = $1
            ORDER BY l.lesson_order
        `;
        const lessonsResult = await pool.query(lessonsQuery, [id]);

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

        res.json({
            id: course.id.toString(),
            title: course.title,
            description: course.description || course.full_description || '',
            image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            tags: course.tags ? course.tags.filter(t => t !== null) : [],
            totalPoints: 100,
            is_published: course.is_published,
            status: course.is_published ? 'published' : 'draft',
            isPreview: true,
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
                isCompleted: false
            })),
            reviews: reviewsResult.rows.map(r => ({
                id: r.id.toString(),
                userName: r.userName,
                avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName)}`,
                rating: r.rating,
                comment: r.comment,
                date: r.date
            }))
        });
    } catch (error) {
        console.error('Error previewing course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Publish/Unpublish Course
const togglePublish = async (req, res) => {
    const { id } = req.params;
    const instructorId = req.user?.id;
    const { publish } = req.body; // true to publish, false to unpublish

    try {
        // Verify ownership
        const ownerCheck = await pool.query(
            'SELECT course_admin_id, is_published FROM courses WHERE id = $1',
            [id]
        );

        if (ownerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (ownerCheck.rows[0].course_admin_id !== instructorId) {
            return res.status(403).json({ error: 'You can only publish your own courses' });
        }

        // Check if course has lessons before publishing
        if (publish) {
            const lessonCount = await pool.query(
                'SELECT COUNT(*) as count FROM lessons WHERE course_id = $1',
                [id]
            );

            if (parseInt(lessonCount.rows[0].count) === 0) {
                return res.status(400).json({
                    error: 'Cannot publish course without lessons',
                    message: 'Please add at least one lesson before publishing'
                });
            }
        }

        // Update publish status
        const updateQuery = `
            UPDATE courses
            SET is_published = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, title, is_published
        `;
        const result = await pool.query(updateQuery, [publish, id]);

        res.json({
            message: publish ? 'Course published successfully' : 'Course unpublished successfully',
            course: {
                id: result.rows[0].id,
                title: result.rows[0].title,
                is_published: result.rows[0].is_published,
                status: result.rows[0].is_published ? 'published' : 'draft'
            }
        });
    } catch (error) {
        console.error('Error toggling publish:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login,
    getProfile,
    listCourses,
    createCourse,
    updateCourse,
    getParticipants,
    getCourse,
    previewCourse,
    togglePublish
};
