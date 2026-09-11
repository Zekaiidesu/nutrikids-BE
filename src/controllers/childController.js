const Child = require('../models/Child');
const Growth = require('../models/Growth');
const { Op } = require('sequelize');

// ==================== ADD CHILD ====================
exports.addChild = async (req, res) => {
  try {
    const { name, nickname, gender, birthDate, weight, height } = req.body;

    const child = await Child.create({
      userId: req.user.id,
      name,
      nickname,
      gender,
      birthDate,
    });

    // Tambah growth history pertama
    if (weight && height) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      
      let status = 'Normal';
      if (bmi < 16) status = 'Kekurangan Gizi';
      else if (bmi < 18.5) status = 'Gizi Kurang';
      else if (bmi < 25) status = 'Gizi Baik';
      else status = 'Risiko Obesitas';

      await Growth.create({
        childId: child.id,
        weight,
        height,
        bmi: Math.round(bmi * 100) / 100,
        status,
        date: new Date(),
      });
    }

    // Ambil child dengan growth history
    const childWithGrowth = await Child.findByPk(child.id, {
      include: [{ model: Growth, as: 'growthHistory' }],
    });

    res.status(201).json({ success: true, child: childWithGrowth });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET ALL CHILDREN ====================
exports.getChildren = async (req, res) => {
  try {
    const children = await Child.findAll({
      where: { userId: req.user.id },
      include: [{ model: Growth, as: 'growthHistory' }],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, count: children.length, children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET SINGLE CHILD ====================
exports.getChild = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Growth, as: 'growthHistory' }],
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    res.json({ success: true, child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ADD GROWTH DATA ====================
exports.addGrowthData = async (req, res) => {
  try {
    const { weight, height, notes } = req.body;

    const child = await Child.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let status = 'Normal';
    if (bmi < 16) status = 'Kekurangan Gizi';
    else if (bmi < 18.5) status = 'Gizi Kurang';
    else if (bmi < 25) status = 'Gizi Baik';
    else status = 'Risiko Obesitas';

    await Growth.create({
      childId: child.id,
      weight,
      height,
      bmi: Math.round(bmi * 100) / 100,
      status,
      notes,
      date: new Date(),
    });

    const childWithGrowth = await Child.findByPk(child.id, {
      include: [{ model: Growth, as: 'growthHistory' }],
    });

    res.json({ success: true, child: childWithGrowth });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== CHECK NUTRITION (BMI) ====================
exports.checkNutrition = async (req, res) => {
  try {
    const { weight, height, age, gender } = req.body;

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

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

// ==================== GET GROWTH CHART ====================
exports.getGrowthChart = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Growth, as: 'growthHistory' }],
    });

    if (!child) {
      return res.status(404).json({ message: 'Data anak tidak ditemukan' });
    }

    const growths = child.growthHistory || [];

    res.json({
      success: true,
      chartData: {
        dates: growths.map((g) => g.date),
        weights: growths.map((g) => g.weight),
        heights: growths.map((g) => g.height),
        bmis: growths.map((g) => g.bmi),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DELETE CHILD ====================
exports.deleteChild = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!child) {
      return res.status(404).json({
        message: 'Data anak tidak ditemukan atau bukan milik Anda',
      });
    }

    await Growth.destroy({ where: { childId: child.id } });
    await child.destroy();

    res.json({
      success: true,
      message: 'Data anak berhasil dihapus',
      deletedId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DELETE ALL CHILDREN ====================
exports.deleteAllChildren = async (req, res) => {
  try {
    const children = await Child.findAll({
      where: { userId: req.user.id },
      attributes: ['id'],
    });

    const childIds = children.map((c) => c.id);

    if (childIds.length > 0) {
      await Growth.destroy({ where: { childId: childIds } });
    }

    const result = await Child.destroy({ where: { userId: req.user.id } });

    res.json({
      success: true,
      message: `${result} data anak berhasil dihapus`,
      deletedCount: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
