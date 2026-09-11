const express = require('express');
const router = express.Router();
const { 
  addChild, 
  getChildren, 
  getChild, 
  addGrowthData, 
  checkNutrition, 
  getGrowthChart,
  deleteChild,
  deleteAllChildren,
} = require('../controllers/childController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/children/check-nutrition:
 *   post:
 *     tags: [Children]
 *     summary: Cek status gizi anak (BMI)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [weight, height, age, gender]
 *             properties:
 *               weight: { type: number, example: 18 }
 *               height: { type: number, example: 105 }
 *               age: { type: number, example: 5 }
 *               gender: { type: string, enum: [Laki-laki, Perempuan] }
 *     responses:
 *       200:
 *         description: Kalkulasi berhasil
 */
router.post('/check-nutrition', checkNutrition);

/**
 * @swagger
 * /api/children:
 *   post:
 *     tags: [Children]
 *     summary: Tambah data anak
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, gender, birthDate, weight, height]
 *             properties:
 *               name: { type: string, example: 'Ahmad Fauzi' }
 *               nickname: { type: string, example: 'Adit' }
 *               gender: { type: string, enum: [Laki-laki, Perempuan] }
 *               birthDate: { type: string, format: date, example: '2021-01-15' }
 *               weight: { type: number, example: 15 }
 *               height: { type: number, example: 95 }
 *     responses:
 *       201:
 *         description: Data anak berhasil ditambahkan
 */
router.post('/', protect, addChild);

/**
 * @swagger
 * /api/children:
 *   get:
 *     tags: [Children]
 *     summary: Lihat semua data anak
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 */
router.get('/', protect, getChildren);

/**
 * @swagger
 * /api/children:
 *   delete:
 *     tags: [Children]
 *     summary: Hapus SEMUA data anak (milik user sendiri)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Semua data anak berhasil dihapus
 */
router.delete('/', protect, deleteAllChildren);

/**
 * @swagger
 * /api/children/{id}:
 *   get:
 *     tags: [Children]
 *     summary: Lihat detail anak
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 */
router.get('/:id', protect, getChild);

/**
 * @swagger
 * /api/children/{id}:
 *   delete:
 *     tags: [Children]
 *     summary: Hapus SATU data anak
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Data anak berhasil dihapus
 */
router.delete('/:id', protect, deleteChild);

/**
 * @swagger
 * /api/children/{id}/growth:
 *   post:
 *     tags: [Children]
 *     summary: Tambah data pertumbuhan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [weight, height]
 *             properties:
 *               weight: { type: number, example: 16 }
 *               height: { type: number, example: 98 }
 *               notes: { type: string, example: 'Bulan ini naik 1 kg' }
 *     responses:
 *       200:
 *         description: Data pertumbuhan berhasil ditambahkan
 */
router.post('/:id/growth', protect, addGrowthData);

/**
 * @swagger
 * /api/children/{id}/chart:
 *   get:
 *     tags: [Children]
 *     summary: Lihat grafik pertumbuhan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data grafik
 */
router.get('/:id/chart', protect, getGrowthChart);

module.exports = router;
