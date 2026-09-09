const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
  },
  description: String,
  targetAmount: {
    type: Number,
    required: true,
  },
  collectedAmount: {
    type: Number,
    default: 0,
  },
  donors: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      message: String,
      isAnonymous: {
        type: Boolean,
        default: false,
      },
    }
  ],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', DonationSchema);
