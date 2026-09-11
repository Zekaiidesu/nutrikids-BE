const Nutrition = require('../models/Nutrition');
const { Op } = require('sequelize');

// ==================== GET ALL ====================
exports.getAllNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findAll();
    res.json({ success: true, count: nutrition.length, nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET BY CATEGORY ====================
exports.getByCategory = async (req, res) => {
  try {
    const nutrition = await Nutrition.findAll({
      where: { category: req.params.category },
    });
    res.json({ success: true, count: nutrition.length, nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET RECOMMENDATIONS ====================
exports.getRecommendations = async (req, res) => {
  try {
    const { age, budget } = req.query;

    const whereClause = {};

    if (age) {
      whereClause.ageMin = { [Op.lte]: parseInt(age) };
      whereClause.ageMax = { [Op.gte]: parseInt(age) };
    }

    if (budget) {
      whereClause.priceCategory = budget;
    }

    const recommendations = await Nutrition.findAll({
      where: whereClause,
      limit: 10,
    });

    res.json({
      success: true,
      recommendations,
      sampleMenu: {
        breakfast: ['Nasi', 'Telur', 'Sayur', 'Pisang', 'Susu'],
        lunch: ['Nasi', 'Ayam', 'Sayur', 'Tempe'],
        dinner: ['Nasi', 'Ikan', 'Sayur', 'Tahu'],
      },
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

// ==================== ADD NUTRITION ====================
exports.addNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.create(req.body);
    res.status(201).json({ success: true, nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
