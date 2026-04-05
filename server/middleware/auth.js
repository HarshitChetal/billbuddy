const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bhai_secret');
      req.user = decoded; // Isme ab ownerId aur subRole dono hain
      next();
    } catch (error) {
      res.status(401).json({ msg: "Token fail ho gaya" });
    }
  }
  if (!token) res.status(401).json({ msg: "No token found" });
};

module.exports = { protect };