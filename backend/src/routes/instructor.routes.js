const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isInstructor } = require('../middleware/auth.middleware');

// Apply Auth & Instructor Middleware
router.use(verifyToken, isInstructor);

// Course Management for Instructor
router.get('/courses', courseController.getMyCourses);
router.get('/students', courseController.getMyStudents);
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);
router.get('/courses/:id', courseController.getCourse); // Required for edit

// Publish
router.patch('/courses/:id/publish', courseController.togglePublish);

module.exports = router;
