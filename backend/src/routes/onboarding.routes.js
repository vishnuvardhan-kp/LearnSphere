const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboarding.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Profile routes
router.get('/profile', onboardingController.getDetails);
router.get('/details', onboardingController.getDetails);
router.post('/details', onboardingController.saveDetails);
router.put('/update', onboardingController.updateProfile);

// Influencers and Companies
router.get('/influencers/all', onboardingController.getAllInfluencers);
router.get('/companies/all', onboardingController.getAllCompanies);

// Social connections
router.post('/social/connect', onboardingController.socialConnect);
router.post('/social/disconnect', onboardingController.socialDisconnect);
router.post('/social/refresh', onboardingController.socialRefresh);

module.exports = router;
