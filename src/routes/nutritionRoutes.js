const express = require('express');
const router = express.Router();
const { 
  getAllNutrition, 
  getByCategory, 
  getRecommendations, 
  addNutrition 
} = require('../controllers/nutritionController');
const { protect, admin } = require('../middleware/auth');

/**
 * @swagger
 * /api/nutrition:
 *   get:
 *     tags: [Nutrition]
 *     summary: Lihat semua data gizi
 *     description: Mendapatkan semua data makanan dan gizi
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: number }
 *                 nutrition: { type: array, items: { $ref: '#/components/schemas/Nutrition' } }
 *       500:
 *         description: Server error
 */
router.get('/', getAllNutrition);

/**
 * @swagger
 * /api/nutrition/recommendations:
 *   get:
 *     tags: [Nutrition]
 *     summary: Rekomendasi makanan
 *     description: Mendapatkan rekomendasi makanan berdasarkan usia dan budget
 *     parameters:
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *         description: Usia anak (tahun)
 *         example: 5
 *       - in: query
 *         name: budget
 *         schema:
 *           type: string
 *           enum: [hemat, sedang, lengkap]
 *         description: Kategori budget
 *         example: hemat
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan rekomendasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 recommendations: { type: array, items: { $ref: '#/components/schemas/Nutrition' } }
 *                 sampleMenu:
 *                   type: object
 *                   properties:
 *                     breakfast: { type: array, items: { type: string } }
 *                     lunch: { type: array, items: { type: string } }
 *                     dinner: { type: array, items: { type: string } }
 *                 tips: { type: array, items: { type: string } }
 *       500:
 *         description: Server error
 */
router.get('/recommendations', getRecommendations);

/**
 * @swagger
 * /api/nutrition/category/{category}:
 *   get:
 *     tags: [Nutrition]
 *     summary: Filter makanan by kategori
 *     description: Mendapatkan makanan berdasarkan kategori
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [protein, carbohydrate, fat, vitamin, mineral]
 *         description: Kategori makanan
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: number }
 *                 nutrition: { type: array, items: { $ref: '#/components/schemas/Nutrition' } }
 *       500:
 *         description: Server error
 */
router.get('/category/:category', getByCategory);

/**
 * @swagger
 * /api/nutrition:
 *   post:
 *     tags: [Nutrition]
 *     summary: Tambah data makanan (Admin)
 *     description: Menambahkan data makanan baru (hanya admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nutrition'
 *     responses:
 *       201:
 *         description: Data makanan berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 nutrition: { $ref: '#/components/schemas/Nutrition' }
 *       403:
 *         description: Akses hanya untuk admin
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Server error
 */
router.post('/', protect, admin, addNutrition);

module.exports = router;
