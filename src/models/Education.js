const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['malnutrisi', 'gizi-dasar', 'berdasarkan-usia', 'pencegahan', 'tips-sehat'],
    required: true,
  },
  subCategory: String,
  content: {
    type: String,
    required: true,
  },
  summary: String,
  ageRange: {
    min: Number,
    max: Number,
  },
  tags: [String],
  imageUrl: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Education', EducationSchema);
