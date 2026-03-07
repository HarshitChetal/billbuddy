const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: "" } // 🆕 Mandatory field for Base64
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);