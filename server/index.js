require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectPostgres } = require('./config/postgres');
const { connectMongoDB } = require('./config/mongodb');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const videoRoutes = require('./routes/video.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kinetic AI API' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to databases
    await connectPostgres();
    await connectMongoDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
