const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Whitelist = require('../models/Whitelist');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ message: "Bhai, email registered nahi hai!" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Galat password!" });
    }

    // Default: ownerId hamesha user ki apni ID hogi [cite: 802]
    let ownerId = user._id;

    // Sirf Manager/Employee ke liye Whitelist se Owner ki ID dhoondo
    if (user.subRole !== 'Owner') {
      const whitelistEntry = await Whitelist.findOne({ email: cleanEmail });
      if (whitelistEntry && whitelistEntry.addedBy) {
        ownerId = whitelistEntry.addedBy; 
      }
    }

    // Token mein dono IDs ja rahi hain [cite: 802]
    const token = jwt.sign(
      { userId: user._id, ownerId: ownerId, subRole: user.subRole },
      process.env.JWT_SECRET || 'bhai_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        subRole: user.subRole, 
        ownerId: ownerId 
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Login Error: " + err.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, subRole, mobileNumber } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return res.status(400).json({ message: "Bhai, account pehle se hai!" });

    const newUser = new User({ 
      email: cleanEmail, 
      password, 
      subRole: subRole || 'Owner', 
      role: 'business',
      mobileNumber: mobileNumber || "0000000000" 
    });

    await newUser.save();
    res.status(201).json({ message: "Signup Success!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;