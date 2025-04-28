const mongoose = require('mongoose');

const videoAnalysisSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  poseData: {
    type: Array,
    default: []
  },
  formScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  movementQuality: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  rangeOfMotion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  symmetry: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  issues: [{
    type: {
      type: String,
      enum: ['alignment', 'range', 'speed', 'stability', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    timeMarkers: {
      start: Number,
      end: Number
    }
  }],
  recommendations: [{
    type: String
  }],
  aiNotes: {
    type: String,
    default: ''
  },
  therapistNotes: {
    type: String,
    default: ''
  },
  therapistId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const VideoAnalysis = mongoose.model('VideoAnalysis', videoAnalysisSchema);

module.exports = VideoAnalysis;
