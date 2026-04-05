const Business = require('../models/Business');

exports.createBusinessProfile = async (req, res) => {
  try {
    const { businessName, businessAddress, contactNumber, businessType, gstNumber } = req.body;
    const ownerId = req.user.userId || req.user.id || req.user._id;

    const business = await Business.findOneAndUpdate(
      { owner: ownerId },
      { businessName, businessAddress, contactNumber, businessType, gstNumber: gstNumber || "NA" },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, data: business });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBusinessStatus = async (req, res) => {
  try {
    const ownerId = req.user.userId || req.user.id || req.user._id;
    const business = await Business.findOne({ owner: ownerId });
    res.json({ hasProfile: !!business });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getBusinessProfile = async (req, res) => {
  try {
    const ownerId = req.user.userId || req.user.id || req.user._id;
    const business = await Business.findOne({ owner: ownerId });
    res.json(business); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPublicBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.params.ownerId });
    if (!business) return res.status(404).json({ message: "Shop details not found" });
    res.json({
      businessName: business.businessName,
      businessAddress: business.businessAddress,
      contactNumber: business.contactNumber,
      gstNumber: business.gstNumber
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};