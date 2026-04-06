const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// Get categories for Blueprint tab
router.get('/', protect, async (req, res) => {
  try {
    const targetId = req.user.ownerId || req.user.userId;
    const categories = await Category.find({ owner: targetId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Sync Error" });
  }
});

// Add new category linked to Owner
router.post('/add', protect, async (req, res) => {
  try {
    const { name, parent, image } = req.body;
    const targetId = req.user.ownerId || req.user.userId;
    
    const newCategory = new Category({
      name, parent: parent || null, image: image || "",
      owner: targetId
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Category creation failed" });
  }
});

module.exports = router;