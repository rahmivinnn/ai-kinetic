import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { logger } from '../utils/logger.js';

// Middleware to authenticate JWT token
export const authenticate = async (req, res, next) => {
  try {
    // In development mode without database, use mock authentication
    if (process.env.NODE_ENV === 'development' && !global.sequelize) {
      logger.warn('Using mock authentication in development mode');

      // Get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For development, allow requests without token
        logger.warn('No token provided, but allowing access in development mode');
        req.user = {
          id: '5394102a-d3f6-43ad-8ebf-4a8f55f709f4',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'patient',
          isActive: true
        };
        return next();
      }

      const token = authHeader.split(' ')[1];

      // Check if it's our mock token
      if (token.startsWith('mock-jwt-token-')) {
        const userId = token.replace('mock-jwt-token-', '');
        req.user = {
          id: userId,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'patient',
          isActive: true
        };
        return next();
      }

      // For development, allow any token
      logger.warn('Invalid token, but allowing access in development mode');
      req.user = {
        id: '5394102a-d3f6-43ad-8ebf-4a8f55f709f4',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'patient',
        isActive: true
      };
      return next();
    }

    // Normal flow with database
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

    // In development mode without database, allow access even with errors
    if (process.env.NODE_ENV === 'development' && !global.sequelize) {
      logger.warn('Authentication error, but allowing access in development mode');
      req.user = {
        id: '5394102a-d3f6-43ad-8ebf-4a8f55f709f4',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'patient',
        isActive: true
      };
      return next();
    }

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
  // In development mode without database, allow access
  if (process.env.NODE_ENV === 'development' && !global.sequelize) {
    logger.warn('Bypassing physiotherapist role check in development mode');
    // Temporarily set the user role to physiotherapist
    req.user.role = 'physiotherapist';
    return next();
  }

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
  // In development mode without database, allow access
  if (process.env.NODE_ENV === 'development' && !global.sequelize) {
    logger.warn('Bypassing admin role check in development mode');
    // Temporarily set the user role to admin
    req.user.role = 'admin';
    return next();
  }

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
  // In development mode without database, allow access
  if (process.env.NODE_ENV === 'development' && !global.sequelize) {
    logger.warn('Bypassing patient role check in development mode');
    // Temporarily set the user role to patient
    req.user.role = 'patient';
    return next();
  }

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
    // In development mode without database, allow access
    if (process.env.NODE_ENV === 'development' && !global.sequelize) {
      logger.warn('Bypassing ownership check in development mode');
      return next();
    }

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

    // In development mode without database, allow access even with errors
    if (process.env.NODE_ENV === 'development' && !global.sequelize) {
      logger.warn('Authorization error, but allowing access in development mode');
      return next();
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
