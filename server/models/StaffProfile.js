const mongoose = require('mongoose');

const staffProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  emergencyContact: { type: String }, // Manager ke liye extra detail
  bio: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StaffProfile', staffProfileSchema);