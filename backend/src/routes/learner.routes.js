const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken, isLearner } = require('../middleware/auth.middleware');

// Public/Open Routes (Browse courses)
// Ideally these should be public, but if system is closed, maybe verifyToken only?
// User requirement: "Learner application". Usually public browsing is allowed.
// But current design suggests "Learner Platform" is behind login?
// Let's allow public browsing without token, or token specific?
// If we use 'isLearner' middleware for everything, then browsing is protected.

// For now, let's keep browsing public-ish, or require token for consistency if entire app is gated.
// Since Learner Frontend has Login page, it implies gating.
// But some course details might be public.

// Let's protect everything for now to be safe.
router.use(verifyToken); 
// Note: We use verifyToken, but not isLearner for browsing, so Instructors/Admins can also see?
// But listPublicCourses filters by is_published.

// Browse
router.get('/courses', courseController.listPublicCourses);
router.get('/courses/:id', courseController.getPublicCourse);

// Enrollment & Progress (Learner Only)
router.get('/my-courses', isLearner, enrollmentController.getEnrolledCourses);
router.post('/enroll', isLearner, enrollmentController.enrollInCourse); // Changed path to generic /enroll
router.post('/progress', isLearner, enrollmentController.updateProgress);
router.get('/progress/:courseId', isLearner, enrollmentController.getCourseProgress);

module.exports = router;
