const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    // Agar Manager login hai toh uska ownerId uthayenge, warna Owner ki apni ID [cite: 350]
    const targetOwnerId = req.user.ownerId || req.user.userId; 
    const products = await Product.find({ owner: targetOwnerId }).populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Inventory load nahi hui: " + err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, categoryId, trackInventory, quantity } = req.body;
    const targetOwnerId = req.user.ownerId || req.user.userId;

    const newProduct = new Product({
      name, price, categoryId, trackInventory, quantity,
      owner: targetOwnerId // Item hamesha Owner ke account mein hi save hogi [cite: 348]
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) { res.status(500).json({ message: err.message }); }
};