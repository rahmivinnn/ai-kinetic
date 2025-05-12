require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for demo purposes
const users = [];
const tokens = {};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kinetic AI API' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const id = uuidv4();
    const newUser = {
      id,
      firstName,
      lastName,
      email,
      password, // In a real app, this would be hashed
      role: role || 'patient',
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = uuidv4();
    tokens[token] = id;

    console.log('Registered user:', { ...newUser, password: '[HIDDEN]' });

    // Return user data and token
    return res.status(201).json({
      id,
      firstName,
      lastName,
      email,
      role: newUser.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(user => user.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = uuidv4();
    tokens[token] = user.id;

    console.log('Logged in user:', { ...user, password: '[HIDDEN]' });

    // Return user data and token
    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const userId = tokens[token];

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = users.find(user => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});
