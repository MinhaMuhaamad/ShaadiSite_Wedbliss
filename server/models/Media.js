const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  mediaType: {
    type: String,
    enum: ['photo', 'video', 'document'],
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryId: String,
  category: {
    type: String,
    enum: ['ceremony', 'reception', 'preparation', 'candid', 'group_photos', 'couple_photos', 'memories', 'other'],
    default: 'other'
  },
  tags: [String],
  uploadedDate: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    userId: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now }
  }],
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    text: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);
