import { User } from '../models/index.js';
import { logger } from '../utils/logger.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // In development mode without database, return mock data
    if (process.env.NODE_ENV === 'development' && !global.sequelize) {
      logger.warn('Using mock data for getAllUsers in development mode');

      // Create mock users
      const mockUsers = [
        {
          id: '5394102a-d3f6-43ad-8ebf-4a8f55f709f4',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'patient',
          profileImage: null,
          dateOfBirth: '1990-01-01',
          gender: 'male',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '6394102a-d3f6-43ad-8ebf-4a8f55f709f5',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'physiotherapist',
          profileImage: null,
          dateOfBirth: '1985-05-15',
          gender: 'male',
          specialization: 'Orthopedic Rehabilitation',
          experience: '10 years',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '7394102a-d3f6-43ad-8ebf-4a8f55f709f6',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          role: 'admin',
          profileImage: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return res.status(200).json({
        success: true,
        count: mockUsers.length,
        data: mockUsers
      });
    }

    // Normal flow with database
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
    // In development mode without database, return mock data
    if (process.env.NODE_ENV === 'development' && !global.sequelize) {
      logger.warn('Using mock data for getAllPhysiotherapists in development mode');

      // Create mock physiotherapists
      const mockPhysiotherapists = [
        {
          id: '6394102a-d3f6-43ad-8ebf-4a8f55f709f5',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'physiotherapist',
          profileImage: null,
          dateOfBirth: '1985-05-15',
          gender: 'male',
          specialization: 'Orthopedic Rehabilitation',
          experience: '10 years',
          bio: 'Specialized in knee and hip rehabilitation with a focus on sports injuries.',
          availability: ['Monday', 'Wednesday', 'Friday'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '8394102a-d3f6-43ad-8ebf-4a8f55f709f7',
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'sarah.smith@example.com',
          role: 'physiotherapist',
          profileImage: null,
          dateOfBirth: '1990-08-20',
          gender: 'female',
          specialization: 'Sports Rehabilitation',
          experience: '8 years',
          bio: 'Former athlete specializing in sports-related injuries and performance optimization.',
          availability: ['Tuesday', 'Thursday', 'Saturday'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return res.status(200).json({
        success: true,
        count: mockPhysiotherapists.length,
        data: mockPhysiotherapists
      });
    }

    // Normal flow with database
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
