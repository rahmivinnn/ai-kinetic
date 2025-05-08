import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Placeholder route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI route is working',
    data: []
  });
});

export default router;
