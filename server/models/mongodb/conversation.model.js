const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['patient', 'physiotherapist', 'admin'],
      required: true
    }
  }],
  title: {
    type: String,
    default: ''
  },
  lastMessage: {
    content: String,
    senderId: String,
    sentAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
conversationSchema.index({ 'participants.userId': 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
