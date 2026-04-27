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
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  blockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reports: [{
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    details: String,
    createdAt: { type: Date, default: Date.now }
  }],
  quotes: [{
    title: { type: String, default: 'Quote Request' },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'cancelled'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    items: [{
      name: { type: String, required: true },
      qty: { type: Number, default: 1 },
      notes: String
    }],
    offers: [{
      offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      notes: String,
      createdAt: { type: Date, default: Date.now }
    }],
    decision: {
      decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      decidedAt: Date,
      decisionNotes: String
    }
  }],
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
