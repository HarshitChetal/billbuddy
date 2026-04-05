const Whitelist = require('../models/Whitelist');
const StaffProfile = require('../models/StaffProfile');

exports.grantAccess = async (req, res) => {
  try {
    const { email, phone, role } = req.body;
    const ownerId = req.user.userId || req.user.id;
    const existing = await Whitelist.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Pehle se whitelisted hai!" });
    const newStaff = new Whitelist({ email, phone, role, addedBy: ownerId });
    await newStaff.save();
    res.status(201).json({ success: true, message: "Access Granted! 🚀" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const profile = await StaffProfile.findOne({ userId });
    if (!profile) return res.json({ fullName: '', phone: '', address: '', emergencyContact: '', bio: '' });
    res.json(profile);
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { fullName, phone, address, emergencyContact, bio } = req.body;

    // Direct update with upsert [cite: 363]
    const profile = await StaffProfile.findOneAndUpdate(
      { userId: userId }, 
      { 
        fullName, 
        phone, 
        address, 
        emergencyContact, 
        bio, 
        updatedAt: Date.now() 
      },
      { new: true, upsert: true, runValidators: false } 
    );

    res.json({ success: true, profile });
  } catch (err) {
    console.error("BACKEND_UPDATE_ERROR:", err);
    res.status(500).json({ success: false, message: "Database Error: " + err.message });
  }
};