const mongoose = require('mongoose');

const whitelistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  role: { type: String, enum: ['Manager', 'Employee'], required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Whitelist', whitelistSchema);