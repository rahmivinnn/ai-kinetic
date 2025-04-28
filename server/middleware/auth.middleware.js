const jwt = require('jsonwebtoken');
const { User } = require('../models/postgres');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const isPhysiotherapist = (req, res, next) => {
  if (req.user && req.user.role === 'physiotherapist') {
    return next();
  }
  
  return res.status(403).json({ message: 'Requires physiotherapist role' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ message: 'Requires admin role' });
};

module.exports = {
  verifyToken,
  isPhysiotherapist,
  isAdmin
};
