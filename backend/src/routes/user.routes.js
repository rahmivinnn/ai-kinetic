import express from 'express';
import {
  getAllUsers,
  getAllPhysiotherapists,
  getAllPatients,
  getUserById,
  updateUser,
  updateProfileImage,
  deactivateUser
} from '../controllers/user.controller.js';
import { authenticate, isAdmin, isOwnerOrPhysiotherapist } from '../middleware/auth.middleware.js';
import { userValidationRules, validate } from '../middleware/validation.middleware.js';
import { uploadProfile, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', isAdmin, getAllUsers);

// Get all physiotherapists
router.get('/physiotherapists', getAllPhysiotherapists);

// Get all patients (physiotherapists and admin only)
router.get('/patients', isOwnerOrPhysiotherapist, getAllPatients);

// Get user by ID
router.get('/:id', isOwnerOrPhysiotherapist, getUserById);

// Update user
router.put('/:id', isOwnerOrPhysiotherapist, userValidationRules.update, validate, updateUser);

// Update profile image
router.put('/:id/profile-image', isOwnerOrPhysiotherapist, uploadProfile.single('profileImage'), handleUploadError, updateProfileImage);

// Deactivate user
router.put('/:id/deactivate', isOwnerOrPhysiotherapist, deactivateUser);

export default router;
