const { predictNutrition, checkMLHealth } = require('../services/mlService');

exports.predictStatusGizi = async (req, res) => {
  try {
    const { gender, age, weight, height } = req.body;

    if (!gender || !age || !weight || !height) {
      return res.status(400).json({
        success: false,
        message: 'Gender, usia, berat, dan tinggi wajib diisi',
      });
    }

    const result = await predictNutrition(gender, age, weight, height);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || 'Gagal memprediksi status gizi',
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.mlHealth = async (req, res) => {
  const status = await checkMLHealth();
  res.json(status);
};
