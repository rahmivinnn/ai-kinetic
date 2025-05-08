import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { logger } from '../utils/logger.js';

// Middleware to authenticate JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been deactivated.' 
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware to check if user is a physiotherapist
export const isPhysiotherapist = (req, res, next) => {
  if (req.user && req.user.role === 'physiotherapist') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Physiotherapist role required.' 
    });
  }
};

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin role required.' 
    });
  }
};

// Middleware to check if user is a patient
export const isPatient = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Patient role required.' 
    });
  }
};

// Middleware to check if user is the owner of the resource or a physiotherapist
export const isOwnerOrPhysiotherapist = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // If user is a physiotherapist, allow access
    if (req.user.role === 'physiotherapist' || req.user.role === 'admin') {
      return next();
    }
    
    // If user is the owner of the resource, allow access
    if (req.user.id === id) {
      return next();
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. You do not have permission to access this resource.' 
    });
  } catch (error) {
    logger.error(`Authorization error: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
