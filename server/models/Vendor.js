const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['catering', 'photography', 'videography', 'venue', 'decoration', 'entertainment', 'flowers', 'makeup', 'invitation', 'transportation', 'other'],
    required: true
  },
  description: String,
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  services: [{
    name: String,
    description: String,
    basePrice: Number,
    currency: { type: String, default: 'USD' }
  }],
  portfolio: [{
    title: String,
    imageUrl: String,
    description: String
  }],
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  availability: {
    startDate: Date,
    endDate: Date,
    bookedDates: [Date]
  },
  pricing: {
    minBudget: Number,
    maxBudget: Number,
    currency: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
