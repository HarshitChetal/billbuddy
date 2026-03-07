const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  trackInventory: { type: Boolean, default: false },
  quantity: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 🆕 Mandatory for visual identity
  image: { type: String, default: "" } 
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);