const express = require('express');
const router = express.Router();
const Whitelist = require('../models/Whitelist');

// API: Staff Authorization
router.post('/add', async (req, res) => {
  try {
    const { email, mobileNumber, role, ownerId } = req.body;
    
    // Check if already exists
    const existing = await Whitelist.findOne({ email });
    if (existing) return res.status(400).json({ message: "Bhai, ye email pehle se whitelisted hai!" });

    const newEntry = new Whitelist({ email, mobileNumber, role, ownerId });
    await newEntry.save();
    
    res.status(200).json({ message: "Staff authorized successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

module.exports = router;