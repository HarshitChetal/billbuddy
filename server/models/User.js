const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  role: { type: String, default: 'business' },
  subRole: { type: String, required: true },
  // 🆕 Naye fields
  username: { type: String, default: "" },
  profilePic: { type: String, default: "" } 
});

module.exports = mongoose.model('User', UserSchema);