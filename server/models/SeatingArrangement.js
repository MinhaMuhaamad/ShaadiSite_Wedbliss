const mongoose = require('mongoose');

const seatingArrangementSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  tables: [{
    tableNumber: Number,
    capacity: Number,
    guests: [{
      guestId: mongoose.Schema.Types.ObjectId,
      seatNumber: Number,
      dietary: String,
      specialNeeds: String
    }],
    location: String,
    description: String
  }],
  layout: {
    style: { type: String, enum: ['round', 'rectangular', 'long', 'other'] },
    totalTables: Number,
    arrangedGuests: Number,
    unassignedGuests: Number
  },
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

module.exports = mongoose.model('SeatingArrangement', seatingArrangementSchema);
