const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { protect } = require('../middleware/auth');

// Business Profile setup aur update ke liye
router.post('/setup', protect, businessController.createBusinessProfile);

// Dashboard par status check karne ke liye
router.get('/status', protect, businessController.getBusinessStatus);

// Settings page par purani details fetch karne ke liye
router.get('/profile', protect, businessController.getBusinessProfile);
router.get('/profile-public/:ownerId', businessController.getPublicBusinessProfile);

module.exports = router;