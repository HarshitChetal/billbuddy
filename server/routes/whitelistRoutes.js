const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

// Grant access for owner [cite: 422, 425]
router.post('/grant', protect, staffController.grantAccess);

// Profile management [cite: 425, 426]
router.get('/my-profile', protect, staffController.getMyProfile);
router.post('/update-profile', protect, staffController.updateMyProfile);

module.exports = router;