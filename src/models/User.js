const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nama wajib diisi'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email wajib diisi'],
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Nomor HP wajib diisi'],
    unique: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password wajib diisi'],
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'kader'], 
    default: 'user' 
  },
  address: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('User', UserSchema);
