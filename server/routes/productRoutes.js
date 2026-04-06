const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.post('/add', protect, async (req, res) => {
  try {
    const { name, price, categoryId, trackInventory, quantity, cgstRate, sgstRate } = req.body;
    
    // 🆕 LINKING: Manager add kare toh bhi Owner ki ID par save ho
    const targetOwnerId = req.user.ownerId || req.user.userId;

    const newProduct = new Product({
      name, price, categoryId, trackInventory, quantity,
      cgstRate: cgstRate || 0,
      sgstRate: sgstRate || 0,
      owner: targetOwnerId 
    });
 
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});

module.exports = router;