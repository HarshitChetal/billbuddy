require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  family: 4, 
  serverSelectionTimeoutMS: 20000, 
})
.then(() => {
  console.log("✅✅✅ BINGO! DATABASE CONNECTED! ✅✅✅");
})
.catch((err) => {
  console.error("❌ DB Connection Error: ", err.message);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/whitelist', require('./routes/whitelistRoutes'));
// 🆕 Business Profile Route Yahan Add Kar Diya Hai
app.use('/api/business', require('./routes/businessRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));