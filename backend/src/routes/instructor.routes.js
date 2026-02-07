const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructor.controller');
const { verifyToken, isInstructor } = require('../middleware/auth.middleware');

// Public routes (no auth required)
// Note: Login is handled by the shared /api/login route

// Protected routes (auth required)
router.get('/profile', verifyToken, isInstructor, instructorController.getProfile);
router.get('/courses', verifyToken, isInstructor, instructorController.listCourses);
router.get('/courses/:id', verifyToken, isInstructor, instructorController.getCourse);
router.post('/courses', verifyToken, isInstructor, instructorController.createCourse);
router.put('/courses/:id', verifyToken, isInstructor, instructorController.updateCourse);
router.get('/participants', verifyToken, isInstructor, instructorController.getParticipants);

// Preview and Publish routes
router.get('/courses/:id/preview', verifyToken, isInstructor, instructorController.previewCourse);
router.patch('/courses/:id/publish', verifyToken, isInstructor, instructorController.togglePublish);

module.exports = router;
