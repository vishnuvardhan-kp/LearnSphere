const { pool } = require('../db');

// List all courses with search and pagination
const listCourses = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT c.*, 
            u.name as author,
            (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as total_lessons,
            (SELECT COALESCE(SUM(l.duration_minutes), 0) FROM lessons l WHERE l.course_id = c.id) as total_duration,
            (SELECT COUNT(DISTINCT ce.user_id) FROM course_enrollments ce WHERE ce.course_id = c.id) as enrolled_students,
            (SELECT array_agg(ct.tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags
            FROM courses c
            LEFT JOIN users u ON c.course_admin_id = u.id
        `;
        const params = [];

        if (search) {
            query += ` WHERE c.title ILIKE $1`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM courses';
        if (search) {
            countQuery += ' WHERE title ILIKE $1';
        }
        const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);

        res.json({
            data: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].count),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Single Course with Details
const getCourse = async (req, res) => {
    const { id } = req.params;
    try {
        // Course Details
        const courseQuery = `
            SELECT c.*, u.name as author 
            FROM courses c 
            LEFT JOIN users u ON c.course_admin_id = u.id 
            WHERE c.id = $1
        `;
        const courseResult = await pool.query(courseQuery, [id]);

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const course = courseResult.rows[0];

        // Tags
        const tagsResult = await pool.query('SELECT tag FROM course_tags WHERE course_id = $1', [id]);
        course.tags = tagsResult.rows.map(r => r.tag);

        // Lessons (grouped by module)
        const lessonsResult = await pool.query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY id', [id]);
        const lessons = lessonsResult.rows;

        // Group lessons into modules
        const modulesMap = new Map();
        lessons.forEach(lesson => {
            const moduleTitle = lesson.module_title || 'General';
            if (!modulesMap.has(moduleTitle)) {
                modulesMap.set(moduleTitle, []);
            }
            modulesMap.get(moduleTitle).push(lesson);
        });

        course.modules = Array.from(modulesMap.entries()).map(([title, lessons]) => ({
            title,
            lessons
        }));

        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new course (Deep Insert)
const createCourse = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            title,
            short_description,
            description,
            image_url = '',
            website_url = '',
            visibility = 'EVERYONE',
            access_rule = 'OPEN',
            price = 0,
            course_admin_id,
            tags = [],
            modules = [] // Array of { title, lessons: [] }
        } = req.body;

        // 1. Insert Course
        const courseQuery = `
            INSERT INTO courses (title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        const courseValues = [title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id];
        const courseResult = await client.query(courseQuery, courseValues);
        const courseId = courseResult.rows[0].id;

        // 2. Insert Tags
        if (tags.length > 0) {
            for (const tag of tags) {
                await client.query('INSERT INTO course_tags (course_id, tag) VALUES ($1, $2)', [courseId, tag]);
            }
        }

        // 3. Insert Modules and Lessons
        if (modules.length > 0) {
            let lessonOrder = 1;
            for (const module of modules) {
                const moduleTitle = module.title;
                if (module.lessons && module.lessons.length > 0) {
                    for (const lesson of module.lessons) {
                        const lessonQuery = `
                            INSERT INTO lessons (course_id, title, type, content_url, duration_minutes, allow_download, lesson_order, module_title)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        `;
                        const lessonValues = [
                            courseId,
                            lesson.title,
                            lesson.type || 'VIDEO',
                            lesson.content_url || '',
                            lesson.duration_minutes || 0,
                            lesson.allow_download || false,
                            lessonOrder++,
                            moduleTitle
                        ];
                        await client.query(lessonQuery, lessonValues);
                    }
                }
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

// Update a course
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id } = req.body;

    try {
        const query = `
            UPDATE courses 
            SET title = $1, short_description = $2, description = $3, image_url = $4, website_url = $5, 
                visibility = $6, access_rule = $7, price = $8, course_admin_id = $9, updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *
        `;
        const values = [title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Toggle Publish Status
const togglePublish = async (req, res) => {
    const { id } = req.params;
    const { is_published } = req.body; // Expecting boolean

    try {
        const query = `
            UPDATE courses 
            SET is_published = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [is_published, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error publishing course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Course (Hard Delete due to Schema strictness)
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        // STRICT SCHEMA RULE: No is_deleted column exists.
        // Implementing HARD DELETE as requested by "proceed it" despite "Soft Delete" requirement.
        // We cannot violate the schema rule "DO NOT invent new columns".
        const query = 'DELETE FROM courses WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully (Hard Delete)' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    listCourses,
    getCourse,
    createCourse,
    updateCourse,
    togglePublish,
    deleteCourse
};
