const { Video, VideoAnalysis } = require('../models/mongodb');
const { Exercise } = require('../models/postgres');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|wmv|mkv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only video files are allowed'));
  }
}).single('video');

// Upload a new video
const uploadVideo = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    
    try {
      const { title, description, exerciseId } = req.body;
      const userId = req.user.id;
      
      // Check if exercise exists
      const exercise = await Exercise.findByPk(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
      
      // Create video record
      const video = new Video({
        userId,
        title: title || 'Untitled Video',
        description: description || '',
        exerciseId,
        fileUrl: `/uploads/${req.file.filename}`,
        status: 'uploaded'
      });
      
      await video.save();
      
      // Trigger AI analysis in background (this would be a queue in production)
      setTimeout(() => {
        analyzeVideo(video._id);
      }, 0);
      
      return res.status(201).json({
        id: video._id,
        title: video.title,
        description: video.description,
        exerciseId: video.exerciseId,
        fileUrl: video.fileUrl,
        status: video.status,
        createdAt: video.createdAt
      });
    } catch (error) {
      console.error('Upload video error:', error);
      return res.status(500).json({ message: 'Server error while uploading video' });
    }
  });
};

// Get all videos for a user
const getUserVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let videos;
    
    if (userRole === 'patient') {
      // Get patient's videos
      videos = await Video.find({ userId }).sort({ createdAt: -1 });
    } else if (userRole === 'physiotherapist') {
      // Get videos assigned to this physiotherapist for review
      videos = await Video.find({
        $or: [
          { reviewedBy: userId },
          { status: 'analyzed', therapistReviewed: false }
        ]
      }).sort({ createdAt: -1 });
    } else {
      // Admin can see all videos
      videos = await Video.find().sort({ createdAt: -1 });
    }
    
    return res.status(200).json(videos);
  } catch (error) {
    console.error('Get user videos error:', error);
    return res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

// Get video by ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user is authorized to view this video
    if (userRole !== 'admin' && userRole !== 'physiotherapist' && video.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this video' });
    }
    
    return res.status(200).json(video);
  } catch (error) {
    console.error('Get video by ID error:', error);
    return res.status(500).json({ message: 'Server error while fetching video' });
  }
};

// Get video analysis
const getVideoAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user is authorized to view this video analysis
    if (userRole !== 'admin' && userRole !== 'physiotherapist' && video.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this video analysis' });
    }
    
    const analysis = await VideoAnalysis.findOne({ videoId: id });
    
    if (!analysis) {
      return res.status(404).json({ message: 'Video analysis not found' });
    }
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Get video analysis error:', error);
    return res.status(500).json({ message: 'Server error while fetching video analysis' });
  }
};

// Add therapist review to video
const addTherapistReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const therapistId = req.user.id;
    
    // Check if user is a physiotherapist
    if (req.user.role !== 'physiotherapist') {
      return res.status(403).json({ message: 'Only physiotherapists can review videos' });
    }
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Update video status
    video.status = 'reviewed';
    video.therapistReviewed = true;
    video.reviewedBy = therapistId;
    await video.save();
    
    // Update analysis with therapist notes
    const analysis = await VideoAnalysis.findOne({ videoId: id });
    
    if (analysis) {
      analysis.therapistNotes = notes;
      analysis.therapistId = therapistId;
      await analysis.save();
    }
    
    return res.status(200).json({
      message: 'Therapist review added successfully',
      video,
      analysis
    });
  } catch (error) {
    console.error('Add therapist review error:', error);
    return res.status(500).json({ message: 'Server error while adding therapist review' });
  }
};

// Helper function to analyze video (would be a separate service in production)
const analyzeVideo = async (videoId) => {
  try {
    const video = await Video.findById(videoId);
    
    if (!video) {
      console.error(`Video not found: ${videoId}`);
      return;
    }
    
    // Update video status
    video.status = 'processing';
    await video.save();
    
    // Simulate AI processing time
    setTimeout(async () => {
      try {
        // Create mock analysis results
        const analysis = new VideoAnalysis({
          videoId,
          userId: video.userId,
          formScore: Math.floor(Math.random() * 40) + 60, // 60-100
          movementQuality: Math.floor(Math.random() * 40) + 60,
          rangeOfMotion: Math.floor(Math.random() * 40) + 60,
          symmetry: Math.floor(Math.random() * 40) + 60,
          issues: [
            {
              type: 'alignment',
              description: 'Slight misalignment in knee position during extension',
              severity: 'low',
              timeMarkers: { start: 5, end: 10 }
            }
          ],
          recommendations: [
            'Focus on keeping your knee aligned with your hip and ankle',
            'Try to maintain a steady pace throughout the exercise',
            'Consider reducing the weight until proper form is achieved'
          ],
          aiNotes: 'Overall good form with minor adjustments needed for optimal results.'
        });
        
        await analysis.save();
        
        // Update video status
        video.status = 'analyzed';
        video.aiAnalysisCompleted = true;
        await video.save();
        
        console.log(`Video analysis completed for: ${videoId}`);
      } catch (error) {
        console.error('Error in video analysis:', error);
      }
    }, 5000); // Simulate 5 second processing time
  } catch (error) {
    console.error('Analyze video error:', error);
  }
};

module.exports = {
  uploadVideo,
  getUserVideos,
  getVideoById,
  getVideoAnalysis,
  addTherapistReview
};
