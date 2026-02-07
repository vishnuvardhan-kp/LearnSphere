const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(verifyToken, isAdmin);

// Routes - middleware already applied via router.use above
router.get('/stats', reportController.getOverviewStats);
router.get('/graph-data', reportController.getGraphData);
router.get('/detailed', reportController.getDetailedReport);
router.get('/activity', reportController.getRecentActivity);
router.get('/analytics', reportController.getAnalytics);

module.exports = router;
