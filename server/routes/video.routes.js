const express = require('express');
const {
  uploadVideo,
  getUserVideos,
  getVideoById,
  getVideoAnalysis,
  addTherapistReview
} = require('../controllers/video.controller');
const { verifyToken, isPhysiotherapist } = require('../middleware/auth.middleware');

const router = express.Router();

// Upload a new video
router.post('/upload', verifyToken, uploadVideo);

// Get all videos for a user
router.get('/', verifyToken, getUserVideos);

// Get video by ID
router.get('/:id', verifyToken, getVideoById);

// Get video analysis
router.get('/:id/analysis', verifyToken, getVideoAnalysis);

// Add therapist review to video
router.post('/:id/review', verifyToken, isPhysiotherapist, addTherapistReview);

module.exports = router;
