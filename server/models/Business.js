const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  businessType: { type: String, required: true }, // e.g., Grocery, Mobile Shop
  gstNumber: { type: String, default: "NA" }, // Verification ki zaroorat nahi
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);