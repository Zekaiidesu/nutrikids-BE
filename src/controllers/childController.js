const Child = require('../models/Child');

// Add child
exports.addChild = async (req, res) => {
  try {
    const { name, nickname, gender, birthDate, weight, height } = req.body;

    const child = await Child.create({
      userId: req.user.id,
      name,
      nickname,
      gender,
      birthDate,
      growthHistory: [
        {
          weight,
          height,
          date: new Date(),
        }
      ],
    });

    res.status(201).json({ success: true, child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all children for a user
exports.getChildren = async (req, res) => {
  try {
    const children = await Child.find({ userId: req.user.id });
    res.json({ success: true, count: children.length, children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single child
exports.getChild = async (req, res) => {
  try {
    const child = await Child.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }
    res.json({ success: true, child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add growth data
exports.addGrowthData = async (req, res) => {
  try {
    const { weight, height, notes } = req.body;
    const child = await Child.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    // Calculate BMI
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    // Determine status (simplified)
    let status = 'Normal';
    if (bmi < 16) status = 'Kekurangan Gizi';
    else if (bmi < 18.5) status = 'Gizi Kurang';
    else if (bmi < 25) status = 'Gizi Baik';
    else status = 'Risiko Obesitas';

    child.growthHistory.push({
      weight,
      height,
      bmi: Math.round(bmi * 100) / 100,
      status,
      notes,
      date: new Date(),
    });

    await child.save();
    res.json({ success: true, child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check nutrition status (calculation)
exports.checkNutrition = async (req, res) => {
  try {
    const { weight, height, age, gender } = req.body;

    // Calculate BMI
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    // Determine status
    let status = 'Normal';
    let recommendation = [];

    if (bmi < 16) {
      status = 'Kekurangan Gizi';
      recommendation = [
        'Segera konsultasikan ke tenaga kesehatan',
        'Tingkatkan asupan protein dan kalori',
        'Berikan makanan bergizi seimbang',
        'Pantau pertumbuhan secara rutin',
      ];
    } else if (bmi < 18.5) {
      status = 'Gizi Kurang';
      recommendation = [
        'Tingkatkan asupan makanan bergizi',
        'Perhatikan pola makan anak',
        'Konsultasikan ke tenaga kesehatan',
        'Berikan makanan dengan protein tinggi',
      ];
    } else if (bmi < 25) {
      status = 'Gizi Baik';
      recommendation = [
        'Pertahankan pola makan sehat',
        'Berikan makanan bergizi seimbang',
        'Pastikan aktivitas fisik cukup',
      ];
    } else {
      status = 'Risiko Obesitas';
      recommendation = [
        'Kurangi makanan tinggi gula dan lemak',
        'Tingkatkan aktivitas fisik',
        'Konsultasikan ke tenaga kesehatan',
        'Terapkan pola makan sehat',
      ];
    }

    res.json({
      success: true,
      data: {
        weight,
        height,
        age,
        gender,
        bmi: Math.round(bmi * 100) / 100,
        status,
        recommendation,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get growth chart data
exports.getGrowthChart = async (req, res) => {
  try {
    const child = await Child.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    const chartData = {
      dates: child.growthHistory.map(g => g.date.toLocaleDateString()),
      weights: child.growthHistory.map(g => g.weight),
      heights: child.growthHistory.map(g => g.height),
      bmis: child.growthHistory.map(g => g.bmi),
    };

    res.json({ success: true, chartData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
