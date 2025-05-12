const express = require('express');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user profile
router.get('/profile', verifyToken, getProfile);

module.exports = router;
