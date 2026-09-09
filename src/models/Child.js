const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Nama anak wajib diisi'],
    trim: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Laki-laki', 'Perempuan'],
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  // Data pertumbuhan
  growthHistory: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      weight: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      bmi: Number,
      status: {
        type: String,
        enum: ['Normal', 'Kekurangan Gizi', 'Gizi Kurang', 'Gizi Baik', 'Risiko Obesitas'],
      },
      notes: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Child', ChildSchema);
