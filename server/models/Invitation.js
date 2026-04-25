const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  customMessage: String,
  template: {
    type: String,
    enum: ['classic', 'modern', 'elegant', 'playful', 'custom'],
    default: 'classic'
  },
  colors: {
    primary: String,
    secondary: String
  },
  customHTML: String,
  sentVia: {
    type: String,
    enum: ['email', 'sms', 'both'],
    default: 'email'
  },
  sentDate: Date,
  openedDate: Date,
  rsvpDeadline: Date,
  guestResponse: {
    status: { type: String, enum: ['pending', 'accepted', 'declined'] },
    numberOfGuests: Number,
    mealChoice: String,
    dietaryRestrictions: [String],
    specialRequests: String,
    respondedDate: Date
  },
  reminders: [{
    sentDate: Date,
    type: { type: String, enum: ['email', 'sms'] }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invitation', invitationSchema);
