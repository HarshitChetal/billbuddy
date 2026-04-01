const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// 1. Create Bill & Deduct Stock [cite: 359, 360]
router.post('/create', protect, async (req, res) => {
  try {
    const { customerName, customerPhone, items, totalBase, totalTax, grandTotal, paymentMode } = req.body;
    const ownerId = req.user.userId || req.user.id;
    const invoiceNumber = `INV-${Date.now()}`;

    const newBill = new Bill({
      invoiceNumber, customerName, customerPhone, items,
      totalBase, totalTax, grandTotal, paymentMode, owner: ownerId
    });

    await newBill.save();

    // Stock Minus Logic [cite: 360]
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    res.status(201).json({ success: true, bill: newBill });
  } catch (err) {
    res.status(500).json({ message: "Billing Failed: " + err.message });
  }
});

// 2. Public Route for Customers (No Protect) [cite: 359]
router.get('/public/:invoiceNumber', async (req, res) => {
  try {
    const bill = await Bill.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;