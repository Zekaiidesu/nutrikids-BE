const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5002';

/**
 * Panggil ML API untuk prediksi status gizi
 */
const predictNutrition = async (gender, age, weight, height) => {
  try {
    const response = await axios.post(
      `${ML_API_URL}/predict`,
      {
        gender,
        age: parseFloat(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
      },
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data;
  } catch (error) {
    console.error('ML Service Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: 'ML Service tidak dapat diakses. Pastikan Flask API berjalan di port 5002.',
      };
    }

    return {
      success: false,
      message: error.response?.data?.message || 'Gagal memprediksi status gizi',
    };
  }
};

/**
 * Cek apakah ML service hidup
 */
const checkMLHealth = async () => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return { status: 'DOWN', message: error.message };
  }
};

module.exports = { predictNutrition, checkMLHealth };
