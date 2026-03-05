// 1. Check karo ki path ekdum sahi ho (models/Business.js)
const Business = require('../models/Business'); 

exports.createBusinessProfile = async (req, res) => {
  try {
    const { businessName, businessAddress, contactNumber, businessType, gstNumber } = req.body;

    // Terminal check for debugging
    console.log("Creating profile for User ID:", req.user.userId);

    // 2. Ensure karo ki yahan 'Business' ka 'B' capital hai (Variable se match hona chahiye)
    const newBusiness = new Business({
      owner: req.user.userId || req.user.id || req.user._id,
      businessName,
      businessAddress,
      contactNumber,
      businessType,
      gstNumber: gstNumber || "NA"
    });

    await newBusiness.save();
    console.log("✅ Business Profile Saved Successfully!");

    res.status(201).json({ 
      success: true, 
      message: "Profile saved successfully!", 
      data: newBusiness 
    });
  } catch (err) {
    // Agar yahan 'Business is not defined' aata hai, toh require line check karo
    console.error("❌ DB Save Error:", err.message);
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