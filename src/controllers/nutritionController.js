const Nutrition = require('../models/Nutrition');

// Get all nutrition data
exports.getAllNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find();
    res.json({ success: true, count: nutrition.length, nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nutrition by category
exports.getByCategory = async (req, res) => {
  try {
    const nutrition = await Nutrition.find({ category: req.params.category });
    res.json({ success: true, count: nutrition.length, nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommendations based on age and budget
exports.getRecommendations = async (req, res) => {
  try {
    const { age, budget, goal } = req.query;

    let query = {};
    
    // Filter by age
    if (age) {
      query['recommendedAge.min'] = { $lte: parseInt(age) };
      query['recommendedAge.max'] = { $gte: parseInt(age) };
    }

    // Filter by budget
    if (budget) {
      query.priceCategory = budget;
    }

    const recommendations = await Nutrition.find(query).limit(10);

    // Generate sample menu
    const sampleMenu = {
      breakfast: ['Nasi', 'Telur', 'Sayur', 'Pisang', 'Susu'],
      lunch: ['Nasi', 'Ayam', 'Sayur', 'Tempe'],
      dinner: ['Nasi', 'Ikan', 'Sayur', 'Tahu'],
    };

    res.json({
      success: true,
      recommendations,
      sampleMenu,
      tips: [
        'Pastikan anak mendapatkan 3 kali makan utama',
        'Berikan 2 kali makanan selingan',
        'Minum air putih yang cukup',
        'Konsumsi protein setiap hari',
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add nutrition data (admin only)
exports.addNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.create(req.body);
    res.status(201).json({ success: true, nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
