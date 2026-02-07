const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);

router.get('/stats', reportController.getOverviewStats);
router.get('/graphs', reportController.getGraphData);
router.get('/progress', reportController.getDetailedReport);

module.exports = router;
