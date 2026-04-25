const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  relationship: {
    type: String,
    enum: ['bride_family', 'groom_family', 'friend', 'colleague', 'other']
  },
  side: {
    type: String,
    enum: ['bride', 'groom', 'both']
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'no_response'],
    default: 'pending'
  },
  rsvpDate: Date,
  numberOfGuests: {
    type: Number,
    default: 1
  },
  dietaryRestrictions: [String],
  specialRequests: String,
  allergies: String,
  seatingPreferences: String,
  mealChoice: String,
  attendanceType: {
    type: String,
    enum: ['ceremony_and_reception', 'ceremony_only', 'reception_only'],
    default: 'ceremony_and_reception'
  },
  invitationSent: {
    type: Boolean,
    default: false
  },
  invitationSentDate: Date,
  tags: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Guest', guestSchema);
