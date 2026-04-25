const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
  brideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  brideName: String,
  groomName: String,
  weddingDate: {
    type: Date,
    required: true
  },
  weddingTime: String,
  venue: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  guests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  }],
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  theme: String,
  colors: {
    primary: String,
    secondary: String
  },
  description: String,
  numberOfGuests: Number,
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'completed', 'cancelled'],
    default: 'planning'
  },
  timeline: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timeline'
  }],
  seatingArrangements: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SeatingArrangement'
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  collaborators: [{
    userId: mongoose.Schema.Types.ObjectId,
    role: String,
    permissions: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wedding', weddingSchema);
