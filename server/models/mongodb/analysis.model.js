const mongoose = require('mongoose');

const PoseKeypointSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  confidence: { type: Number, required: true },
  name: { type: String, required: true }
});

const FeedbackSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  comment: { type: String, required: true },
  physiotherapistId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const AnalysisSchema = new mongoose.Schema({
  videoId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  poseKeypoints: [PoseKeypointSchema],
  injuryRiskScore: { type: Number, min: 0, max: 100 },
  performanceMetrics: {
    formAccuracy: { type: Number, min: 0, max: 100 },
    rangeOfMotion: { type: Number, min: 0, max: 100 },
    stability: { type: Number, min: 0, max: 100 },
    consistency: { type: Number, min: 0, max: 100 },
    speed: { type: Number, min: 0, max: 100 }
  },
  progressTracking: {
    previousScores: [{
      date: { type: Date, required: true },
      overallScore: { type: Number, min: 0, max: 100 },
      metrics: {
        formAccuracy: Number,
        rangeOfMotion: Number,
        stability: Number,
        consistency: Number,
        speed: Number
      }
    }],
    improvement: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    }
  },
  aiNotes: [{
    type: { type: String, enum: ['posture', 'movement', 'balance', 'form', 'technique'], required: true },
    description: { type: String, required: true },
    confidence: { type: Number, required: true },
    timeStamp: { type: Number },
    severity: { type: String, enum: ['low', 'medium', 'high'] }
  }],
  feedback: [FeedbackSchema],
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  exercisePlan: {
    exercises: [{
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      duration: { type: Number },
      instructions: { type: String, required: true }
    }],
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    focusAreas: [{ type: String }],
    updatedBy: { type: String },
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster queries
AnalysisSchema.index({ videoId: 1, userId: 1 }, { unique: true });
AnalysisSchema.index({ createdAt: -1 });

const Analysis = mongoose.model('Analysis', AnalysisSchema);

module.exports = Analysis;