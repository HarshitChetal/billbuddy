const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// 1. Get All Products
router.get('/products', protect, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.userId }).populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Get All Categories
router.get('/categories', protect, async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user.userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;