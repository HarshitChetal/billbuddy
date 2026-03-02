const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- LOGIN ROUTE (Missing tha, ab add kar diya) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. User dhundo
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Bhai, ye email registered nahi hai!" });

    // 2. Password check (Abhi plain text, baad mein bcrypt lagaenge)
    if (user.password !== password) {
      return res.status(400).json({ message: "Galat password!" });
    }

    // 3. Token generate karo
    const token = jwt.sign(
      { userId: user._id, subRole: user.subRole },
      process.env.JWT_SECRET || 'bhai_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, subRole: user.subRole }
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// --- SIGNUP ROUTE (Pura logic) ---
router.post('/signup', async (req, res) => {
  try {
    const { email, password, subRole, mobileNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Bhai, account pehle se hai!" });

    const newUser = new User({ 
      email, 
      password, 
      subRole: subRole || 'Owner', 
      role: 'business', // Model ki requirement satisfy karne ke liye
      mobileNumber: mobileNumber || "0000000000" 
    });

    await newUser.save();
    res.status(201).json({ message: "Signup Success! Ab Login karo." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;