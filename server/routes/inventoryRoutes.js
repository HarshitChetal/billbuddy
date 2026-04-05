const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// 1. Get All Products (Owner + Manager both can see Owner's data)
router.get('/products', protect, async (req, res) => {
  try {
    // 🆕 THE FIX: Use ownerId from token if available, else use userId
    const targetOwnerId = req.user.ownerId || req.user.userId; 
    
    const products = await Product.find({ owner: targetOwnerId }).populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Products load nahi hue: " + err.message });
  }
});

// 2. Get All Categories (Owner + Manager both can see Owner's blueprint)
router.get('/categories', protect, async (req, res) => {
  try {
    // 🆕 THE FIX: Use ownerId from token if available, else use userId
    const targetOwnerId = req.user.ownerId || req.user.userId;

    const categories = await Category.find({ owner: targetOwnerId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Categories load nahi hui: " + err.message });
  }
});

module.exports = router;