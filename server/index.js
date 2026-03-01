require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const authRoutes = require('./routes/auth');
const whitelistRoutes = require('./routes/whitelistRoutes'); // ✅ Fixed: Match with your filename

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); 

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ BillBuddy Cloud DB Connected"))
  .catch((err) => console.error("❌ DB Connection Error: ", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/whitelist', whitelistRoutes); // ✅ Fixed: Using the correct variable

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));