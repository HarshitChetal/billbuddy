const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
// 🆕 Yahan '.protect' lagana zaroori hai kyunki tune isi naam se export kiya hai
const { protect } = require('../middleware/auth'); 

// 🆕 Ab yahan 'auth' ki jagah 'protect' use karo
router.post('/setup', protect, businessController.createBusinessProfile);
router.get('/status', protect, businessController.getBusinessStatus);

module.exports = router;