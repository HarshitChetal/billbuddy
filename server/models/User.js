const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  mobileNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['business', 'consumer'], // Sirf yehi do main roles allowed hain
    required: true 
  },
  subRole: { 
    type: String, 
    // Business ke liye: Owner, Manager, Employee | Consumer ke liye: Consumer
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);