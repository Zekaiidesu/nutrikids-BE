const express = require('express');
const router = express.Router();
const { register, login, getMe, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register user baru
 *     description: Registrasi menggunakan nama, email, nomor HP, dan password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Budi Santoso'
 *               email:
 *                 type: string
 *                 example: 'budi@email.com'
 *               phone:
 *                 type: string
 *                 example: '081234567890'
 *               password:
 *                 type: string
 *                 example: '123456'
 *               address:
 *                 type: string
 *                 example: 'Jl. Merdeka No. 10, Jakarta'
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email/HP sudah terdaftar / validasi gagal
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user
 *     description: Login menggunakan email ATAU nomor HP + password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'budi@email.com'
 *                 description: Isi salah satu (email atau phone)
 *               phone:
 *                 type: string
 *                 example: '081234567890'
 *                 description: Isi salah satu (email atau phone)
 *               password:
 *                 type: string
 *                 example: '123456'
 *             oneOf:
 *               - required: [email, password]
 *               - required: [phone, password]
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email/HP atau password salah
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get profile user
 *     description: Mendapatkan data user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil didapat
 *       401:
 *         description: Token tidak valid
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     tags: [Users]
 *     summary: Update profile user
 *     description: Update nama dan alamat user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Budi Santoso Updated'
 *               address:
 *                 type: string
 *                 example: 'Jl. Sudirman No. 5, Jakarta'
 *     responses:
 *       200:
 *         description: Update berhasil
 *       401:
 *         description: Token tidak valid
 */
router.put('/me', protect, updateUser);

module.exports = router;
