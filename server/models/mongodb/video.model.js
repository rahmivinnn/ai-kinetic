const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  exerciseId: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'reviewed'],
    default: 'uploaded'
  },
  aiAnalysisCompleted: {
    type: Boolean,
    default: false
  },
  therapistReviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: String,
    default: null
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
