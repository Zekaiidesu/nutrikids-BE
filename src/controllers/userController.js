const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== REGISTER ====================
// Bisa pakai email + phone
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // Validasi
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: 'Nama, email, nomor HP, dan password wajib diisi' 
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Format email tidak valid' });
    }

    // Validasi format nomor HP (Indonesia)
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: 'Format nomor HP tidak valid. Contoh: 081234567890' 
      });
    }

    // Cek email sudah terdaftar
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Cek nomor HP sudah terdaftar
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'Nomor HP sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== LOGIN (Email atau HP) ====================
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validasi: harus isi salah satu (email atau phone)
    if ((!email && !phone) || !password) {
      return res.status(400).json({ 
        message: 'Email/Nomor HP dan password wajib diisi' 
      });
    }

    // Cari user berdasarkan email atau phone
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(401).json({ 
        message: 'Email/Nomor HP atau password salah' 
      });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Email/Nomor HP atau password salah' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET PROFILE ====================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== UPDATE PROFILE ====================
exports.updateUser = async (req, res) => {
  try {
    // Jangan izinkan ganti email/phone sembarangan (untuk keamanan)
    const allowedUpdates = ['name', 'address'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
