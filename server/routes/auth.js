const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Whitelist = require('../models/Whitelist'); 

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  console.log("Signup Request Aayi:", req.body);
  try {
    const { email, password, subRole } = req.body;

    // 1. Existing User Check
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Bhai, account pehle se bana hai!" });

    // 2. Role Check (Case-Insensitive fix)
    // Hum trim() aur toLowerCase() use karenge taaki spelling ki galti na ho
    const normalizedRole = subRole ? subRole.trim() : "";

    if (normalizedRole !== 'Owner') {
      console.log("Checking Whitelist for non-owner:", email);
      const isWhitelisted = await Whitelist.findOne({ email, role: normalizedRole });
      
      if (!isWhitelisted) {
        console.log("Whitelist entry NOT found in DB!");
        return res.status(403).json({ message: "Bhai, Owner ne whitelist nahi kiya!" });
      }
      console.log("Whitelist verified!");
    } else {
      console.log("Owner bypass: Whitelist check skipped.");
    }

    // 3. Save User
    const newUser = new User({ email, password, subRole: normalizedRole });
    await newUser.save();
    console.log("✅ User Save Ho Gaya in Atlas!");
    
    res.status(201).json({ message: "Mubarak ho! Signup success." });
  } catch (err) {
    console.error("❌ CRASH ERROR:", err.message);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// ... baaki login route same rahega