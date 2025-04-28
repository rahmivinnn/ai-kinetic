const { User } = require('../models/postgres');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, profilePicture } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is authorized to update
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      profilePicture: profilePicture || user.profilePicture
    });
    
    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Server error while updating user' });
  }
};

// Get all physiotherapists
const getAllPhysiotherapists = async (req, res) => {
  try {
    const physiotherapists = await User.findAll({
      where: { role: 'physiotherapist' },
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json(physiotherapists);
  } catch (error) {
    console.error('Get all physiotherapists error:', error);
    return res.status(500).json({ message: 'Server error while fetching physiotherapists' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  getAllPhysiotherapists
};
