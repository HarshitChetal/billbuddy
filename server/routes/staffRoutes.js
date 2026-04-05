const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

router.post('/grant', protect, staffController.grantAccess);

module.exports = router;