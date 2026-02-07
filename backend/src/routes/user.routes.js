const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);

router.get('/', userController.listUsers);
router.patch('/:id/status', userController.toggleUserStatus);

router.get('/learners', userController.getLearners);
router.get('/instructors', userController.getInstructors);
router.post('/instructors', userController.createInstructor);
router.put('/:id', userController.updateInstructor);
router.delete('/:id', userController.deleteInstructor);

module.exports = router;
