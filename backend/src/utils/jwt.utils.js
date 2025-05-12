import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

// Generate JWT token
export const generateToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'jwt-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  } catch (error) {
    logger.error(`Error generating JWT token: ${error.message}`);
    throw new Error('Error generating token');
  }
};

// Generate refresh token
export const generateRefreshToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
  } catch (error) {
    logger.error(`Error generating refresh token: ${error.message}`);
    throw new Error('Error generating refresh token');
  }
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret');
  } catch (error) {
    logger.error(`Error verifying JWT token: ${error.message}`);
    throw error;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
  } catch (error) {
    logger.error(`Error verifying refresh token: ${error.message}`);
    throw error;
  }
};
