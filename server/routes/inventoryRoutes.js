const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// 1. Get All Products (Owner ki linked inventory)
router.get('/products', protect, async (req, res) => {
  try {
    const targetOwnerId = req.user.ownerId || req.user.userId; 
    const products = await Product.find({ owner: targetOwnerId }).populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Products load nahi hue: " + err.message });
  }
});

// 2. Get All Categories (Owner ka linked blueprint)
router.get('/categories', protect, async (req, res) => {
  try {
    const targetOwnerId = req.user.ownerId || req.user.userId;
    const categories = await Category.find({ owner: targetOwnerId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Blueprint load nahi hua: " + err.message });
  }
});

module.exports = router;