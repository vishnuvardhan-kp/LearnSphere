const express = require('express');
const cors = require('cors');
const app = express();

// CORS Configuration - Allow all frontends (flexible for development)
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Allow all localhost origins for development
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// ===========================================
// ADMIN ROUTES (DO NOT MODIFY)
// ===========================================
const adminAuthRoutes = require('./routes/auth.routes');
const adminCourseRoutes = require('./routes/course.routes');
const adminUserRoutes = require('./routes/user.routes');
const adminReportRoutes = require('./routes/report.routes');

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/courses', adminCourseRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/reports', adminReportRoutes);

// ===========================================
// INSTRUCTOR ROUTES (NEW)
// ===========================================
const instructorRoutes = require('./routes/instructor.routes');
const instructorController = require('./controllers/instructor.controller');

app.use('/api/instructor', instructorRoutes);

// Shared routes for Instructor frontend (backwards compatibility)
// These routes are what the Instructor frontend currently expects
const { verifyToken, optionalAuth } = require('./middleware/auth.middleware');

app.post('/api/login', instructorController.login);
app.get('/api/onboarding/profile', verifyToken, instructorController.getProfile);
app.get('/api/courses', optionalAuth, instructorController.listCourses);
app.post('/api/courses', verifyToken, instructorController.createCourse);
app.put('/api/courses/:id', verifyToken, instructorController.updateCourse);
app.get('/api/courses/:id', optionalAuth, instructorController.getCourse);
app.get('/api/participants', verifyToken, instructorController.getParticipants);

// Preview and Publish routes for Instructor
app.get('/api/courses/:id/preview', verifyToken, instructorController.previewCourse);
app.patch('/api/courses/:id/publish', verifyToken, instructorController.togglePublish);

// ===========================================
// LEARNER ROUTES (NEW)
// ===========================================
const learnerRoutes = require('./routes/learner.routes');

app.use('/api/learner', learnerRoutes);

// ===========================================
// ONBOARDING & AI ROUTES (NEW)
// ===========================================
const onboardingRoutes = require('./routes/onboarding.routes');
const aiRoutes = require('./routes/ai.routes');

app.use('/api/onboarding', onboardingRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
