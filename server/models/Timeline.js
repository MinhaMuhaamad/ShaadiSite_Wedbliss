const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['ceremony', 'reception', 'cocktail', 'dinner', 'entertainment', 'photo', 'other'],
    default: 'other'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  duration: Number,
  location: String,
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  vendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  reminders: [{
    time: Date,
    type: { type: String, enum: ['email', 'sms', 'notification'] }
  }],
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Timeline', timelineSchema);
