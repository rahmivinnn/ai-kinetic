const express = require('express');
const { getAllUsers, getUserById, updateUser, getAllPhysiotherapists } = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, getAllUsers);

// Get all physiotherapists
router.get('/physiotherapists', verifyToken, getAllPhysiotherapists);

// Get user by ID
router.get('/:id', verifyToken, getUserById);

// Update user
router.put('/:id', verifyToken, updateUser);

module.exports = router;
