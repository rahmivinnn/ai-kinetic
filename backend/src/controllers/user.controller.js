import { User } from '../models/index.js';
import { logger } from '../utils/logger.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all physiotherapists
export const getAllPhysiotherapists = async (req, res) => {
  try {
    const physiotherapists = await User.findAll({
      where: { role: 'physiotherapist', isActive: true },
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    return res.status(200).json({
      success: true,
      count: physiotherapists.length,
      data: physiotherapists
    });
  } catch (error) {
    logger.error(`Get all physiotherapists error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching physiotherapists',
      error: error.message
    });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.findAll({
      where: { role: 'patient', isActive: true },
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    logger.error(`Get all patients error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Get user by ID error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is authorized to update
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }
    
    // Fields that can be updated
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      emergencyContact,
      medicalHistory,
      specialization,
      experience,
      bio,
      availability
    } = req.body;
    
    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      gender: gender || user.gender,
      phoneNumber: phoneNumber || user.phoneNumber,
      address: address || user.address,
      emergencyContact: emergencyContact || user.emergencyContact,
      medicalHistory: medicalHistory || user.medicalHistory,
      specialization: specialization || user.specialization,
      experience: experience || user.experience,
      bio: bio || user.bio,
      availability: availability || user.availability
    });
    
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        address: user.address,
        emergencyContact: user.emergencyContact,
        medicalHistory: user.medicalHistory,
        specialization: user.specialization,
        experience: user.experience,
        bio: user.bio,
        availability: user.availability,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Update profile image
export const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is authorized to update
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Update profile image
    const profileImageUrl = `/uploads/profiles/${req.file.filename}`;
    await user.update({ profileImage: profileImageUrl });
    
    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        profileImage: profileImageUrl
      }
    });
  } catch (error) {
    logger.error(`Update profile image error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile image',
      error: error.message
    });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Only admin can deactivate other users
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to deactivate this user'
      });
    }
    
    // Deactivate user
    await user.update({ isActive: false });
    
    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    logger.error(`Deactivate user error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Error deactivating user',
      error: error.message
    });
  }
};
