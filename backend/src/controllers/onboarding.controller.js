const { pool } = require('../db');
require('dotenv').config();

// Get onboarding details for current user
const getDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isOnboarded: true
        });
    } catch (error) {
        console.error('Error getting details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Save onboarding details
const saveDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { onboardingData } = req.body;

        // For now, just acknowledge the onboarding data
        // In a real app, you might store this in a separate table
        console.log('Onboarding data received for user', userId, ':', onboardingData);

        res.json({
            message: 'Onboarding details saved successfully',
            isOnboarded: true
        });
    } catch (error) {
        console.error('Error saving details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        const query = `
            UPDATE users
            SET name = COALESCE($1, name),
                email = COALESCE($2, email),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, name, email, role
        `;
        const result = await pool.query(query, [name, email, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all instructors (influencers in frontend terminology)
const getAllInfluencers = async (req, res) => {
    try {
        const query = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.avatar_url,
                u.created_at,
                COUNT(DISTINCT c.id) as courses_count,
                COUNT(DISTINCT ce.user_id) as students_count,
                COALESCE(AVG(cr.rating), 0) as avg_rating
            FROM users u
            LEFT JOIN courses c ON u.id = c.course_admin_id
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            LEFT JOIN course_reviews cr ON c.id = cr.course_id
            WHERE u.role = 'INSTRUCTOR'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `;
        const result = await pool.query(query);

        // Format for frontend compatibility
        const influencers = result.rows.map(u => ({
            _id: u.id,
            name: u.name,
            email: u.email,
            role: 'influencer',
            avatar: u.avatar_url,
            isOnboarded: true,
            onboardingData: {
                platforms: ['youtube'],
                niche: 'Education'
            },
            youtubeStats: {
                overall_stats: {
                    subscribers: parseInt(u.students_count) * 100 || 0,
                    views: parseInt(u.courses_count) * 1000 || 0
                }
            },
            instagramStats: {
                follower_count: parseInt(u.students_count) * 50 || 0
            },
            stats: {
                courses: parseInt(u.courses_count) || 0,
                students: parseInt(u.students_count) || 0,
                rating: parseFloat(u.avg_rating) || 0
            }
        }));

        res.json(influencers);
    } catch (error) {
        console.error('Error fetching influencers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all companies (learners in this context, or could be organizations)
const getAllCompanies = async (req, res) => {
    try {
        // In a learning platform context, "companies" could be organizations
        // For now, return a placeholder response
        const query = `
            SELECT DISTINCT
                u.id,
                u.name,
                u.email,
                u.created_at
            FROM users u
            WHERE u.role = 'LEARNER'
            ORDER BY u.created_at DESC
            LIMIT 20
        `;
        const result = await pool.query(query);

        const companies = result.rows.map(u => ({
            _id: u.id,
            name: u.name,
            email: u.email,
            role: 'company',
            isOnboarded: true,
            onboardingData: {
                orgType: 'Individual',
                industry: 'Technology',
                market: 'Global'
            }
        }));

        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Social connect (placeholder - would connect to real social APIs)
const socialConnect = async (req, res) => {
    try {
        const { platform, handle } = req.body;
        const userId = req.user.id;

        // In a real app, you'd verify the social account and fetch stats
        console.log(`User ${userId} connecting ${platform} account: ${handle}`);

        // Return mock stats for demonstration
        const mockStats = {
            platform,
            handle,
            connected: true,
            stats: platform === 'youtube'
                ? { subscribers: 1000, views: 50000, videos: 25 }
                : { followers: 2000, posts: 100, engagement: '4.5%' }
        };

        res.json({
            message: `${platform} account connected successfully`,
            stats: mockStats
        });
    } catch (error) {
        console.error('Error connecting social:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Social disconnect
const socialDisconnect = async (req, res) => {
    try {
        const { platform } = req.body;
        const userId = req.user.id;

        console.log(`User ${userId} disconnecting ${platform} account`);

        res.json({
            message: `${platform} account disconnected successfully`
        });
    } catch (error) {
        console.error('Error disconnecting social:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Social refresh (refresh stats from social platforms)
const socialRefresh = async (req, res) => {
    try {
        const { platform } = req.body;
        const userId = req.user.id;

        console.log(`User ${userId} refreshing ${platform} stats`);

        // Return updated mock stats
        const mockStats = platform === 'youtube'
            ? { subscribers: 1050, views: 52000, videos: 26 }
            : { followers: 2100, posts: 102, engagement: '4.7%' };

        res.json({
            message: 'Stats refreshed successfully',
            stats: mockStats
        });
    } catch (error) {
        console.error('Error refreshing social:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getDetails,
    saveDetails,
    updateProfile,
    getAllInfluencers,
    getAllCompanies,
    socialConnect,
    socialDisconnect,
    socialRefresh
};
