const { Product } = require('../models/schemas');


exports.addProduct = async (req, res) => {
  try {
    const { name, category, attributes, price, quantityInStock, unitType } = req.body;

    const newProduct = new Product({
      companyId: req.user.companyId,
      name,
      category,
      attributes,
      price,
      quantityInStock,
      unitType
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product added successfully!", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding dynamic product");
  }
};


exports.getInventory = async (req, res) => {
  try {
    const inventory = await Product.find({ companyId: req.user.companyId });
    res.json(inventory);
  } catch (err) {
    res.status(500).send("Error fetching inventory");
  }
};