const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'exercise', 'assessment', 'feedback', 'notification'],
    default: 'text'
  },
  content: {
    type: String,
    required: true
  },
  richContent: {
    title: String,
    description: String,
    metadata: Object
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio', 'exercise-data', 'assessment-report'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: String,
    size: Number,
    mimeType: String,
    thumbnail: String,
    duration: Number,
    preview: String
  }],
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  readBy: [{
    userId: String,
    readAt: Date,
    deviceInfo: {
      type: String,
      platform: String,
      browser: String
    }
  }],
  reactions: [{
    userId: String,
    type: String,
    createdAt: Date
  }],
  references: [{
    type: {
      type: String,
      enum: ['exercise', 'assessment', 'video', 'conversation'],
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }],
  isAIGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
