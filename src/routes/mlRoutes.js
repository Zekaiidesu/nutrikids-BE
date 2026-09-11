const express = require('express');
const router = express.Router();
const { predictStatusGizi, mlHealth } = require('../controllers/mlController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/ml/health:
 *   get:
 *     tags: [ML]
 *     summary: Cek status ML service
 *     responses:
 *       200:
 *         description: ML service status
 */
router.get('/health', mlHealth);

/**
 * @swagger
 * /api/ml/predict:
 *   post:
 *     tags: [ML]
 *     summary: Prediksi status gizi anak pakai Machine Learning
 *     description: Menggunakan model KMeans Clustering untuk prediksi kategori risiko gizi anak
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gender, age, weight, height]
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [Laki-laki, Perempuan]
 *                 example: 'Perempuan'
 *               age:
 *                 type: number
 *                 example: 2
 *               weight:
 *                 type: number
 *                 example: 8.0
 *               height:
 *                 type: number
 *                 example: 88.0
 *     responses:
 *       200:
 *         description: Prediksi berhasil
 *       400:
 *         description: Input tidak lengkap
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: ML service error
 */
router.post('/predict', protect, predictStatusGizi);

module.exports = router;
