const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Whitelist = require('../models/Whitelist');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Bhai, email registered nahi hai!" });
    if (user.password !== password) return res.status(400).json({ message: "Galat password!" });

    // Manager ke liye Owner ki ID nikalna
    let ownerId = user._id;
    if (user.subRole !== 'Owner') {
      const whitelistEntry = await Whitelist.findOne({ email: user.email });
      ownerId = whitelistEntry ? whitelistEntry.addedBy : user._id;
    }

    const token = jwt.sign(
      { userId: user._id, ownerId: ownerId, subRole: user.subRole },
      process.env.JWT_SECRET || 'bhai_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, subRole: user.subRole, ownerId: ownerId }
    });
  } catch (err) {
    res.status(500).json({ message: "Login Error: " + err.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, subRole, mobileNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Account pehle se hai!" });

    const newUser = new User({ email, password, subRole: subRole || 'Owner', mobileNumber });
    await newUser.save();
    res.status(201).json({ message: "Signup Success!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;