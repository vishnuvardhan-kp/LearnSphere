const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Apply Admin Auth middleware to all routes
router.use(verifyToken, isAdmin);

router.get('/', courseController.listCourses);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.patch('/:id/publish', courseController.togglePublish); // Specific endpoint for publishing
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
