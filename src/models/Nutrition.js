const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['protein', 'carbohydrate', 'fat', 'vitamin', 'mineral'],
    required: true,
  },
  description: String,
  calories: Number,
  protein: Number,
  carbohydrate: Number,
  fat: Number,
  vitamins: [String],
  minerals: [String],
  imageUrl: String,
  // Untuk rekomendasi berdasarkan usia
  recommendedAge: {
    min: Number,
    max: Number,
  },
  priceCategory: {
    type: String,
    enum: ['hemat', 'sedang', 'lengkap'],
    default: 'sedang',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Nutrition', NutritionSchema);
