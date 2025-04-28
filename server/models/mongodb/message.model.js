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
  content: {
    type: String,
    required: true
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: String,
    size: Number,
    mimeType: String
  }],
  readBy: [{
    userId: String,
    readAt: Date
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
