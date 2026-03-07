const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// 1. Fetch all variables
router.get('/', protect, async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user.userId || req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Sync Error" });
  }
});

// 2. Add New with Image
router.post('/add', protect, async (req, res) => {
  try {
    const { name, parent, image } = req.body;
    const newCategory = new Category({
      name,
      parent: parent || null,
      image: image || "",
      owner: req.user.userId || req.user.id
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Provisioning failed" });
  }
});

// 3. Update Visual (Sophisticated Patch)
router.patch('/:id/image', protect, async (req, res) => {
  try {
    const { image } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId || req.user.id },
      { image: image },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Layer not found" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 4. Delete
router.delete('/:id', protect, async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id, owner: req.user.userId || req.user.id });
    res.json({ success: true, message: "De-provisioned" });
  } catch (err) {
    res.status(500).json({ message: "Deletion Error" });
  }
});

module.exports = router;