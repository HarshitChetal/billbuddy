const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product'); // 🆕 Linked products delete karne ke liye
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

// 2. Add New Category
router.post('/add', protect, async (req, res) => {
  try {
    const { name, parent, image } = req.body;
    const newCategory = new Category({
      name, parent: parent || null, image: image || "",
      owner: req.user.userId || req.user.id
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Provisioning failed" });
  }
});

// 3. 🆕 THE FIX: Delete Category & ALL linked Products
router.delete('/:id', protect, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const ownerId = req.user.userId || req.user.id;

    // Pehle Category udao
    await Category.deleteOne({ _id: categoryId, owner: ownerId });

    // PHIR USSE JUDE SAARE PRODUCTS BHI UDAO (Live Stock Sync) 
    await Product.deleteMany({ categoryId: categoryId, owner: ownerId });

    res.json({ success: true, message: "Blueprint and Linked Assets deleted." });
  } catch (err) {
    res.status(500).json({ message: "Deletion Error" });
  }
});

module.exports = router;