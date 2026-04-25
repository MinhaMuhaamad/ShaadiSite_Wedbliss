const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  totalBudget: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  categories: [{
    name: String,
    allocatedAmount: Number,
    spent: {
      type: Number,
      default: 0
    },
    description: String,
    items: [{
      itemName: String,
      vendor: String,
      amount: Number,
      status: { type: String, enum: ['pending', 'confirmed', 'paid', 'cancelled'], default: 'pending' },
      date: Date,
      notes: String
    }]
  }],
  totalSpent: {
    type: Number,
    default: 0
  },
  remainingBudget: {
    type: Number,
    default: 0
  },
  payments: [{
    vendorId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    status: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
    dueDate: Date,
    paidDate: Date,
    notes: String
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

module.exports = mongoose.model('Budget', budgetSchema);
