const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/user-auth.controller');

// POST /api/auth/login - Login for both instructors and learners
router.post('/login', userAuthController.login);

// POST /api/auth/signup - Signup for learners only
router.post('/signup', userAuthController.signup);

module.exports = router;
