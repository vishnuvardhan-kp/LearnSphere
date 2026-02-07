const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);

router.get('/', userController.listUsers);
router.patch('/:id/status', userController.toggleUserStatus);

module.exports = router;
