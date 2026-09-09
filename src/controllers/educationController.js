const Education = require('../models/Education');

// Get all education articles
exports.getAllArticles = async (req, res) => {
  try {
    const { category, age } = req.query;
    let query = {};

    if (category) query.category = category;
    if (age) {
      query['ageRange.min'] = { $lte: parseInt(age) };
      query['ageRange.max'] = { $gte: parseInt(age) };
    }

    const articles = await Education.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single article
exports.getArticle = async (req, res) => {
  try {
    const article = await Education.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }
    article.views += 1;
    await article.save();
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create article (admin)
exports.createArticle = async (req, res) => {
  try {
    const article = await Education.create({
      ...req.body,
      author: req.user.id,
    });
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get articles by category
exports.getByCategory = async (req, res) => {
  try {
    const articles = await Education.find({ category: req.params.category });
    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get prevention timeline
exports.getPreventionTimeline = async (req, res) => {
  try {
    const timeline = {
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
    };

    res.json({ success: true, timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
