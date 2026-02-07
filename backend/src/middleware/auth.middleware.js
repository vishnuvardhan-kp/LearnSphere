const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
};

const isInstructor = (req, res, next) => {
    if (req.user && (req.user.role === 'INSTRUCTOR' || req.user.role === 'instructor')) {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Instructors only.', userRole: req.user ? req.user.role : 'none' });
    }
};

const isLearner = (req, res, next) => {
    if (req.user && (req.user.role === 'LEARNER' || req.user.role === 'learner')) {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Learners only.', userRole: req.user ? req.user.role : 'none' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isInstructor,
    isLearner
};
