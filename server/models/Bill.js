const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    cgstRate: Number,
    sgstRate: Number,
    total: Number
  }],
  totalBase: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentMode: { type: String, default: 'Cash' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);