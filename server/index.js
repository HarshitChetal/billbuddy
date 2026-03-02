require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors()); 

// Database Connection with 20-second timeout
mongoose.connect(process.env.MONGO_URI, {
  family: 4, // IPv4 force karne ke liye
  serverSelectionTimeoutMS: 20000, // 👈 20 seconds ka wait
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));