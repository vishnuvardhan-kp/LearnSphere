const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);
// Routes
router.get('/stats', verifyToken, isAdmin, reportController.getOverviewStats);
router.get('/graph-data', verifyToken, isAdmin, reportController.getGraphData);
router.get('/detailed', verifyToken, isAdmin, reportController.getDetailedReport);
router.get('/activity', verifyToken, isAdmin, reportController.getRecentActivity);
router.get('/analytics', verifyToken, isAdmin, reportController.getAnalytics);

module.exports = router;
