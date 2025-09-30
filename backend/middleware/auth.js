const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    req.user = user;
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
