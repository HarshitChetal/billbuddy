const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Fetch all products [cite: 312]
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.userId || req.user.id }).populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Asset sync failed." });
  }
});

// Register asset with image 
router.post('/add', protect, async (req, res) => {
  try {
    const { name, price, categoryId, trackInventory, quantity, image } = req.body;
    const newProduct = new Product({
      name, 
      price, 
      categoryId, 
      trackInventory, 
      quantity,
      image: image || "", // 🆕 Image field explicitly mapped 
      owner: req.user.userId || req.user.id
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Registration error: " + err.message });
  }
});

module.exports = router;