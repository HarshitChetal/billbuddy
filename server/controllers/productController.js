const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { name, categoryId, price, barcode, trackInventory, quantity } = req.body;
    const ownerId = req.user.userId || req.user.id;

    const newProduct = new Product({
      owner: ownerId,
      categoryId,
      name,
      price,
      barcode: barcode || null,
      trackInventory: trackInventory || false,
      quantity: trackInventory ? quantity : 0
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const ownerId = req.user.userId || req.user.id;
    const products = await Product.find({ owner: ownerId }).populate('categoryId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};