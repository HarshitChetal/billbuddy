require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

// 🆕 LIMIT FIX: Base64 images ke liye limit badhana mandatory hai 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  family: 4, 
  serverSelectionTimeoutMS: 20000, 
})
.then(() => console.log("✅ BINGO! DATABASE CONNECTED!"))
.catch((err) => console.error("❌ DB Connection Error: ", err.message));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/whitelist', require('./routes/whitelistRoutes'));
app.use('/api/business', require('./routes/businessRoutes'));
app.use('/api/inventory/categories', require('./routes/categoryRoutes'));
app.use('/api/inventory/products', require('./routes/productRoutes'));

// 🆕 BILLING LOGIC INJECTED
app.use('/api/bills', require('./routes/billRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));