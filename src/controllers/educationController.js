const Education = require('../models/Education');
const { Op } = require('sequelize');

// ==================== GET ALL ARTICLES ====================
exports.getAllArticles = async (req, res) => {
  try {
    const { category, age } = req.query;
    const whereClause = {};

    if (category) whereClause.category = category;

    if (age) {
      whereClause.ageMin = { [Op.lte]: parseInt(age) };
      whereClause.ageMax = { [Op.gte]: parseInt(age) };
    }

    const articles = await Education.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET SINGLE ARTICLE ====================
exports.getArticle = async (req, res) => {
  try {
    const article = await Education.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET BY CATEGORY ====================
exports.getByCategory = async (req, res) => {
  try {
    const articles = await Education.findAll({
      where: { category: req.params.category },
    });
    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== CREATE ARTICLE ====================
exports.createArticle = async (req, res) => {
  try {
    const article = await Education.create(req.body);
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PREVENTION TIMELINE ====================
exports.getPreventionTimeline = async (req, res) => {
  try {
    res.json({
      success: true,
      timeline: {
        bayi: {
          title: 'Tahap 1 - Bayi',
          tips: [
            'ASI sesuai rekomendasi',
            'Pemantauan pertumbuhan',
            'Imunisasi',
            'Pemberian MPASI sesuai usia',
          ],
        },
        balita: {
          title: 'Tahap 2 - Balita',
          tips: [
            'Makanan beragam',
            'Protein cukup',
            'Sayur dan buah',
            'Pemantauan berat dan tinggi badan',
          ],
        },
        anak: {
          title: 'Tahap 3 - Anak',
          tips: [
            'Pola makan seimbang',
            'Aktivitas fisik',
            'Tidur cukup',
            'Edukasi mengenai makanan sehat',
          ],
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
