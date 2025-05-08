import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import videoRoutes from './routes/video.routes.js';
import aiRoutes from './routes/ai.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to databases
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AI Kinetic API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Export app
export default app;
