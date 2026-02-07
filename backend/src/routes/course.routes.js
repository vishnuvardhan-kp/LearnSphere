const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Apply Admin Auth middleware to all routes
router.use(verifyToken, isAdmin);

router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourse);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.patch('/:id/publish', courseController.togglePublish);
router.delete('/:id', courseController.deleteCourse);

// Lesson routes
router.post('/:id/lessons', courseController.addLesson);
router.put('/:id/lessons/:lessonId', courseController.updateLesson);
router.delete('/:id/lessons/:lessonId', courseController.deleteLesson);

module.exports = router;
