const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

const adminAuthRoutes = require('./routes/auth.routes');
const adminCourseRoutes = require('./routes/course.routes');
const adminUserRoutes = require('./routes/user.routes');
const adminReportRoutes = require('./routes/report.routes');
const userAuthRoutes = require('./routes/user-auth.routes');

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/courses', adminCourseRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/reports', adminReportRoutes);

// Instructor Routes
app.use('/api/instructor', require('./routes/instructor.routes'));

// Learner Routes
app.use('/api/learner', require('./routes/learner.routes'));

// Unified Auth Routes for Instructors & Learners
app.use('/api/auth', userAuthRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
