const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding'
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'vendor'],
    default: 'direct'
  },
  name: String,
  description: String,
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: String,
    mediaUrl: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readBy: [{
      userId: mongoose.Schema.Types.ObjectId,
      readAt: Date
    }]
  }],
  lastMessage: {
    text: String,
    timestamp: Date,
    senderId: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
