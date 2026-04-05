const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

router.post('/grant', protect, staffController.grantAccess);
router.get('/my-profile', protect, staffController.getMyProfile);
router.post('/update-profile', protect, staffController.updateMyProfile);
router.get('/list', protect, staffController.getStaffList);

module.exports = router;