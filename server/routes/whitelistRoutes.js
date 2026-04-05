const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

// Path: /api/whitelist/grant
router.post('/grant', protect, staffController.grantAccess);

// Path: /api/whitelist/my-profile
router.get('/my-profile', protect, staffController.getMyProfile);

// Path: /api/whitelist/update-profile
router.post('/update-profile', protect, staffController.updateMyProfile);

// Path: /api/whitelist/list
router.get('/list', protect, staffController.getStaffList);

module.exports = router;