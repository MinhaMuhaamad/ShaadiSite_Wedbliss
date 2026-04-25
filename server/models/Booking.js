const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  serviceId: String,
  status: {
    type: String,
    enum: ['inquiry', 'quoted', 'confirmed', 'completed', 'cancelled'],
    default: 'inquiry'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  eventDate: Date,
  eventTime: String,
  location: String,
  description: String,
  quotedPrice: Number,
  finalPrice: Number,
  currency: { type: String, default: 'USD' },
  depositAmount: Number,
  depositPaid: {
    type: Boolean,
    default: false
  },
  depositPaidDate: Date,
  paymentDueDate: Date,
  notes: String,
  contract: {
    fileName: String,
    url: String,
    uploadedDate: Date
  },
  communications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
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

module.exports = mongoose.model('Booking', bookingSchema);
