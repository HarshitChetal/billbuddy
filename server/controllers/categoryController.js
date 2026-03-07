const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const ownerId = req.user.userId || req.user.id;

    const newCategory = new Category({
      name,
      parent: parent || null,
      owner: ownerId
    });

    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const ownerId = req.user.userId || req.user.id;
    const categories = await Category.find({ owner: ownerId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};