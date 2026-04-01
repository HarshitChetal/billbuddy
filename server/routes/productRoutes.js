const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// 1. FETCH ALL ASSETS (Inventory List ke liye) [cite: 374]
router.get('/', protect, async (req, res) => {
  try {
    // Owner ke basis par products filter karna aur category detail nikalna
    const products = await Product.find({ owner: req.user.userId || req.user.id })
                                  .populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Asset sync failed." });
  }
});

// 2. REGISTER NEW ASSET (Naya Product add karne ke liye) [cite: 375-376]
router.post('/add', protect, async (req, res) => {
  try {
    const { name, price, categoryId, trackInventory, quantity, image, cgstRate, sgstRate } = req.body;
    
    // Naya Product Object banana saare tax fields ke saath [cite: 339, 375]
    const newProduct = new Product({
      name, 
      price, 
      categoryId, 
      trackInventory, 
      quantity,
      image: image || "", 
      cgstRate: cgstRate || 0, // 🆕 CGST field mapping
      sgstRate: sgstRate || 0, // 🆕 SGST field mapping
      owner: req.user.userId || req.user.id // Token se owner ID lena [cite: 330-332]
    });
 
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Registration error: " + err.message });
  }
});

module.exports = router;