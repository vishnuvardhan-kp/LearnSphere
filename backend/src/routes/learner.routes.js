const express = require('express');
const router = express.Router();
const learnerController = require('../controllers/learner.controller');
const { verifyToken, isLearner, optionalAuth } = require('../middleware/auth.middleware');

// Auth routes
router.post('/login', learnerController.login);

// Profile routes (auth required)
router.get('/profile', verifyToken, isLearner, learnerController.getProfile);
router.get('/stats', verifyToken, isLearner, learnerController.getUserStats);

// Course browsing (optional auth - show personalized data if logged in)
router.get('/courses', optionalAuth, learnerController.listCourses);
router.get('/courses/:id', optionalAuth, learnerController.getCourseDetail);

// Enrollment routes (auth required)
router.post('/courses/:courseId/enroll', verifyToken, isLearner, learnerController.enrollCourse);
router.get('/enrolled', verifyToken, isLearner, learnerController.getEnrolledCourses);

// Lesson and Progress routes (auth required)
router.get('/courses/:courseId/lessons/:lessonId', optionalAuth, learnerController.getLessonContent);
router.post('/courses/:courseId/lessons/:lessonId/complete', verifyToken, isLearner, learnerController.completeLessonProgress);
router.post('/courses/:courseId/lessons/:lessonId/quiz', verifyToken, isLearner, learnerController.submitQuiz);

// Review routes (auth required)
router.post('/courses/:courseId/review', verifyToken, isLearner, learnerController.submitReview);

module.exports = router;
