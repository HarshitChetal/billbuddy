const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.userId || req.user.id })
                                  .populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Asset sync failed." });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { name, price, categoryId, trackInventory, quantity, image, cgstRate, sgstRate } = req.body;
    
    const newProduct = new Product({
      name, 
      price, 
      categoryId, 
      trackInventory, 
      quantity,
      image: image || "", 
      cgstRate: cgstRate || 0,
      sgstRate: sgstRate || 0,
      owner: req.user.userId || req.user.id
    });
 
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Registration error: " + err.message });
  }
});

router.patch('/update-stock/:id', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    const ownerId = req.user.userId || req.user.id;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, owner: ownerId },
      { quantity: Number(quantity) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product nahi mila" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;