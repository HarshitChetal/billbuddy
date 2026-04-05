const Whitelist = require('../models/Whitelist');
const StaffProfile = require('../models/StaffProfile');

// 1. Grant Access (Owner only)
exports.grantAccess = async (req, res) => {
  try {
    const { email, phone, role } = req.body;
    const ownerId = req.user.userId || req.user.id || req.user._id;

    const existing = await Whitelist.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Pehle se whitelisted hai!" });

    const newStaff = new Whitelist({ email, phone, role, addedBy: ownerId });
    await newStaff.save();
    res.status(201).json({ success: true, message: "Access Granted! 🚀" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Get Profile (Manager/Employee)
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const profile = await StaffProfile.findOne({ userId });
    
    if (!profile) {
      return res.json({ fullName: '', phone: '', address: '', emergencyContact: '', bio: '' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Update Profile (Manager/Employee)
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { fullName, phone, address, emergencyContact, bio } = req.body;

    const profile = await StaffProfile.findOneAndUpdate(
      { userId },
      { fullName, phone, address, emergencyContact, bio, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Staff List (Optional for Owner)
exports.getStaffList = async (req, res) => {
  try {
    const ownerId = req.user.userId || req.user.id;
    const list = await Whitelist.find({ addedBy: ownerId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};