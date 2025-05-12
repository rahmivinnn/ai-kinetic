import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed'],
    default: 'pending'
  },
  aiScore: {
    type: Number,
    min: 0,
    max: 100
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
  therapistReview: {
    id: {
      type: String
    },
    content: {
      type: String
    },
    therapistId: {
      type: String,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  isLibraryVideo: {
    type: Boolean,
    default: false
  },
  category: {
    type: String
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  uploadedBy: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  metadata: {
    duration: Number,
    fileSize: Number,
    fileType: String
  }
}, {
  timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
