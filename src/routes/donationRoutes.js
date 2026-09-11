const express = require('express');
const router = express.Router();
const { 
  getPrograms, 
  getProgram, 
  createProgram, 
  donate, 
  getMyDonations 
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/auth');

/**
 * @swagger
 * /api/donations:
 *   get:
 *     tags: [Donations]
 *     summary: Lihat semua program donasi
 *     description: Mendapatkan semua program donasi yang aktif
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
 *                 programs: { type: array, items: { $ref: '#/components/schemas/Donation' } }
 *       500:
 *         description: Server error
 */
router.get('/', getPrograms);

/**
 * @swagger
 * /api/donations/my-donations:
 *   get:
 *     tags: [Donations]
 *     summary: Lihat riwayat donasi sendiri
 *     description: Mendapatkan semua donasi yang pernah dilakukan user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 history: { type: array }
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Server error
 */
router.get('/my-donations', protect, getMyDonations);

/**
 * @swagger
 * /api/donations/{id}:
 *   get:
 *     tags: [Donations]
 *     summary: Lihat detail program donasi
 *     description: Mendapatkan detail satu program donasi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID program
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 program: { $ref: '#/components/schemas/Donation' }
 *       404:
 *         description: Program tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get('/:id', getProgram);

/**
 * @swagger
 * /api/donations:
 *   post:
 *     tags: [Donations]
 *     summary: Buat program donasi (Admin)
 *     description: Membuat program donasi baru (hanya admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [programName, targetAmount]
 *             properties:
 *               programName: { type: string, example: 'Paket Makan Bergizi' }
 *               description: { type: string }
 *               targetAmount: { type: number, example: 10000000 }
 *     responses:
 *       201:
 *         description: Program berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 program: { $ref: '#/components/schemas/Donation' }
 *       403:
 *         description: Akses hanya untuk admin
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Server error
 */
router.post('/', protect, admin, createProgram);

/**
 * @swagger
 * /api/donations/{id}/donate:
 *   post:
 *     tags: [Donations]
 *     summary: Donasi ke program
 *     description: Melakukan donasi ke program yang dipilih
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID program
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number, example: 100000 }
 *               message: { type: string, example: 'Semoga bermanfaat' }
 *               isAnonymous: { type: boolean, example: false }
 *     responses:
 *       200:
 *         description: Donasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 program: { $ref: '#/components/schemas/Donation' }
 *       404:
 *         description: Program tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Server error
 */
router.post('/:id/donate', protect, donate);

module.exports = router;
