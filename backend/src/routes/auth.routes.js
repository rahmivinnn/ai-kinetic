import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { userValidationRules, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Register a new user
router.post('/register', userValidationRules.register, validate, register);

// Login user
router.post('/login', userValidationRules.login, validate, login);

// Refresh token
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.use(authenticate);

// Logout user
router.post('/logout', logout);

// Get current user profile
router.get('/profile', getProfile);

// Change password
router.post('/change-password', changePassword);

export default router;
