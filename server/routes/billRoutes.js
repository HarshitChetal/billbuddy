const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.post('/create', protect, async (req, res) => {
  try {
    const { customerName, customerPhone, items, totalBase, totalTax, grandTotal, paymentMode } = req.body;
    const ownerId = req.user.userId || req.user.id;

    // 1. Unique Invoice Number Generate Karo (Timestamp based)
    const invoiceNumber = `INV-${Date.now()}`;

    // 2. Bill Save Karo
    const newBill = new Bill({
      invoiceNumber, customerName, customerPhone, items,
      totalBase, totalTax, grandTotal, paymentMode, owner: ownerId
    });

    await newBill.save();

    // 3. 🆕 AUTOMATION: Stock Minus Karo
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity } // Jitna bika utna minus
      });
    }

    res.status(201).json({ success: true, bill: newBill });
  } catch (err) {
    res.status(500).json({ message: "Billing Failed: " + err.message });
  }
});

module.exports = router;