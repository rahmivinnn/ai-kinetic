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
  realTimeMetrics: {
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
    speed: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    stability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  frameByFrameAnalysis: [{
    timestamp: Number,
    keypoints: Array,
    angles: Array,
    velocities: Array,
    accelerations: Array
  }],
  issues: [{
    type: {
      type: String,
      enum: ['alignment', 'range', 'speed', 'stability', 'balance', 'coordination', 'other'],
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
    },
    suggestedCorrections: [{
      instruction: String,
      visualGuide: String
    }],
    status: {
      type: String,
      enum: ['identified', 'addressed', 'resolved'],
      default: 'identified'
    }
  }],
  recommendations: [{
    type: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: ['technique', 'form', 'equipment', 'training', 'safety'],
      required: true
    },
    timeline: {
      type: String,
      enum: ['immediate', 'short-term', 'long-term'],
      default: 'immediate'
    },
    implementationSteps: [String]
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
