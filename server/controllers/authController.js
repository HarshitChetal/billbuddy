const { User, Company, Leave } = require('../models/schemas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerOwner = async (req, res) => {
  try {
    const { name, email, password, companyName, businessCategory, shopNumber, shopEmail } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already registered" });

    const newCompany = new Company({ name: companyName, ownerName: name, businessCategory, shopOfficialNumber: shopNumber, shopOfficialEmail: shopEmail });
    const savedCompany = await newCompany.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role: 'owner', companyId: savedCompany._id });
    await user.save();

    const token = jwt.sign({ userId: user._id, companyId: savedCompany._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, company: savedCompany });
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id, companyId: user.companyId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, role: user.role, leaveBalance: user.leaveBalance } });
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const user = await User.findById(req.user.userId);

    let isOverLimit = false;
    if (type === 'Sick' && user.leaveBalance.sick <= 0) isOverLimit = true;
    if (type === 'Casual' && user.leaveBalance.casual <= 0) isOverLimit = true;

    const newLeave = new Leave({
      userId: req.user.userId,
      companyId: req.user.companyId,
      type, startDate, endDate, reason, isOverLimit
    });

    await newLeave.save();
    res.status(201).json({ 
      msg: "Leave Applied", 
      isOverLimit, 
      note: isOverLimit ? "Emergency Notification sent to Owner (Zero Balance)." : "Waiting for approval." 
    });
  } catch (err) { res.status(500).send("Leave Error"); }
};