const { pool } = require('../db');

// List all courses with search and pagination
const listCourses = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT c.*, 
            (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as total_lessons,
            (SELECT COALESCE(SUM(l.duration_minutes), 0) FROM lessons l WHERE l.course_id = c.id) as total_duration
            FROM courses c
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

// Create a new course
const createCourse = async (req, res) => {
    const { title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id } = req.body;

    try {
        const query = `
            INSERT INTO courses (title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [title, short_description, description, image_url, website_url, visibility, access_rule, price, course_admin_id];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Internal server error' });
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
    createCourse,
    updateCourse,
    togglePublish,
    deleteCourse
};
