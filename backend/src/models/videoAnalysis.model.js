import mongoose from 'mongoose';

const videoAnalysisSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    ref: 'Video'
  },
  patientId: {
    type: String,
    required: true,
    ref: 'User'
  },
  exerciseId: {
    type: String,
    ref: 'Exercise'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  formScore: {
    type: Number,
    min: 0,
    max: 100
  },
  movementQuality: {
    type: Number,
    min: 0,
    max: 100
  },
  rangeOfMotion: {
    type: Number,
    min: 0,
    max: 100
  },
  symmetry: {
    type: Number,
    min: 0,
    max: 100
  },
  issues: [{
    type: {
      type: String,
      enum: ['form', 'alignment', 'range', 'tempo', 'balance'],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    timeMarkers: {
      start: Number,
      end: Number
    }
  }],
  recommendations: [String],
  poseData: {
    type: mongoose.Schema.Types.Mixed
  },
  keyframes: [{
    timestamp: Number,
    imageUrl: String,
    issues: [String]
  }]
}, {
  timestamps: true
});

const VideoAnalysis = mongoose.model('VideoAnalysis', videoAnalysisSchema);

export default VideoAnalysis;
