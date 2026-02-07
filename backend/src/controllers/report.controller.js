const { pool } = require('../db');

// Get Overview Stats
const getOverviewStats = async (req, res) => {
    try {
        // Total participants: Count unique users in course_enrollments
        const totalParticipantsQuery = 'SELECT COUNT(DISTINCT user_id) as count FROM course_enrollments';
        const totalParticipantsResult = await pool.query(totalParticipantsQuery);

        // Status counts from course_progress
        // Statuses: YET_TO_START, IN_PROGRESS, COMPLETED
        const statusQuery = `
            SELECT status, COUNT(*) as count 
            FROM course_progress 
            GROUP BY status
        `;
        const statusResult = await pool.query(statusQuery);

        const stats = {
            total_participants: parseInt(totalParticipantsResult.rows[0].count),
            course_status_distribution: {
                YET_TO_START: 0,
                IN_PROGRESS: 0,
                COMPLETED: 0
            }
        };

        statusResult.rows.forEach(row => {
            if (stats.course_status_distribution[row.status] !== undefined) {
                stats.course_status_distribution[row.status] = parseInt(row.count);
            }
        });

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Detailed Progress Report
const getDetailedReport = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                c.title as course_name,
                u.name as participant_name,
                cp.completion_percentage,
                cp.status
            FROM course_progress cp
            JOIN courses c ON cp.course_id = c.id
            JOIN users u ON cp.user_id = u.id
            ORDER BY cp.completed_date DESC NULLS LAST, cp.start_date DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await pool.query(query, [limit, offset]);

        // Total count for pagination
        const countQuery = 'SELECT COUNT(*) FROM course_progress';
        const countResult = await pool.query(countQuery);

        res.json({
            data: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].count),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Graph Data (Enrollments & Course Performance)
const getGraphData = async (req, res) => {
    try {
        // 1. Enrollments over last 7 days
        const enrollmentQuery = `
            SELECT to_char(d, 'Dy') as day_name, COUNT(ce.id) as count
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') as d
            LEFT JOIN course_enrollments ce ON DATE(ce.enrolled_at) = d
            GROUP BY d
            ORDER BY d
        `;
        const enrollmentResult = await pool.query(enrollmentQuery);

        // 2. Top 5 Courses Performance (Students vs Completions)
        const performanceQuery = `
            SELECT 
                c.title as name, 
                COUNT(ce.id) as students,
                (SELECT COUNT(*) FROM course_progress cp WHERE cp.course_id = c.id AND cp.status = 'COMPLETED') as completions
            FROM courses c
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            GROUP BY c.id
            ORDER BY students DESC
            LIMIT 5
        `;
        const performanceResult = await pool.query(performanceQuery);

        res.json({
            enrollments: enrollmentResult.rows,
            coursePerformance: performanceResult.rows
        });
    } catch (error) {
        console.error('Error fetching graph data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getOverviewStats,
    getDetailedReport,
    getGraphData
};
