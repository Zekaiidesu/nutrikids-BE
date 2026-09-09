const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Nutrition = require('./src/models/Nutrition');
const Education = require('./src/models/Education');
const Donation = require('./src/models/Donation');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Nutrition.deleteMany({});
    await Education.deleteMany({});
    await Donation.deleteMany({});
    console.log('🗑️  Existing data cleared');

    // Seed Nutrition
    await Nutrition.create([
      { 
        name: 'Telur', 
        category: 'protein', 
        description: 'Sumber protein hewani yang mudah didapat dan terjangkau', 
        calories: 155, 
        protein: 13, 
        carbohydrate: 1.1, 
        fat: 11, 
        vitamins: ['Vitamin A', 'Vitamin D', 'Vitamin B12'], 
        minerals: ['Zat Besi', 'Seng'], 
        recommendedAge: { min: 0.5, max: 12 }, 
        priceCategory: 'hemat' 
      },
      { 
        name: 'Ikan Salmon', 
        category: 'protein', 
        description: 'Kaya akan omega-3 dan protein untuk pertumbuhan otak', 
        calories: 208, 
        protein: 22, 
        carbohydrate: 0, 
        fat: 13, 
        vitamins: ['Vitamin D', 'Vitamin B6', 'Vitamin B12'], 
        minerals: ['Selenium', 'Kalium'], 
        recommendedAge: { min: 1, max: 12 }, 
        priceCategory: 'lengkap' 
      },
      { 
        name: 'Nasi Putih', 
        category: 'carbohydrate', 
        description: 'Sumber karbohidrat utama untuk energi', 
        calories: 130, 
        protein: 2.7, 
        carbohydrate: 28, 
        fat: 0.3, 
        vitamins: ['Vitamin B1'], 
        minerals: ['Zat Besi'], 
        recommendedAge: { min: 0.5, max: 12 }, 
        priceCategory: 'hemat' 
      },
      { 
        name: 'Tempe', 
        category: 'protein', 
        description: 'Sumber protein nabati yang terjangkau', 
        calories: 193, 
        protein: 18.5, 
        carbohydrate: 9.4, 
        fat: 8.5, 
        vitamins: ['Vitamin B12', 'Vitamin B6'], 
        minerals: ['Kalsium', 'Zat Besi'], 
        recommendedAge: { min: 1, max: 12 }, 
        priceCategory: 'hemat' 
      },
      { 
        name: 'Susu Sapi', 
        category: 'protein', 
        description: 'Sumber kalsium dan protein untuk pertumbuhan tulang', 
        calories: 150, 
        protein: 8, 
        carbohydrate: 12, 
        fat: 8, 
        vitamins: ['Vitamin A', 'Vitamin D', 'Vitamin B12'], 
        minerals: ['Kalsium', 'Fosfor'], 
        recommendedAge: { min: 0.5, max: 12 }, 
        priceCategory: 'sedang' 
      },
    ]);
    console.log('✅ Nutrition data seeded');

    // Seed Education
    await Education.create([
      { 
        title: 'Apa itu Malnutrisi?', 
        category: 'malnutrisi', 
        content: 'Malnutrisi adalah kondisi kekurangan atau kelebihan gizi yang dapat mempengaruhi kesehatan dan tumbuh kembang anak. Malnutrisi dapat menyebabkan stunting, wasting, dan masalah kesehatan lainnya.', 
        summary: 'Pahami penyebab dan dampak malnutrisi pada anak', 
        ageRange: { min: 0, max: 12 }, 
        tags: ['malnutrisi', 'gizi', 'kesehatan anak'] 
      },
      { 
        title: 'Apa itu Stunting?', 
        category: 'malnutrisi', 
        content: 'Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis, terutama pada 1000 hari pertama kehidupan. Anak stunting memiliki tinggi badan di bawah standar usianya.', 
        summary: 'Kenali penyebab dan pencegahan stunting', 
        ageRange: { min: 0, max: 5 }, 
        tags: ['stunting', 'pertumbuhan', 'gizi'] 
      },
      { 
        title: 'Tips MPASI Sehat', 
        category: 'berdasarkan-usia', 
        content: 'MPASI (Makanan Pendamping ASI) harus diberikan pada usia 6 bulan dengan makanan bergizi seimbang. Mulai dari bubur, lalu tekstur yang lebih kasar seiring usia anak.', 
        summary: 'Panduan MPASI untuk bayi 6-12 bulan', 
        ageRange: { min: 0.5, max: 1 }, 
        tags: ['mpasi', 'bayi', 'gizi'] 
      },
    ]);
    console.log('✅ Education data seeded');

    // Seed Donation
    await Donation.create([
      { 
        programName: 'Paket Makanan Bergizi Anak', 
        description: 'Bantu anak-anak mendapatkan makanan bergizi untuk mendukung tumbuh kembang mereka', 
        targetAmount: 10000000, 
        collectedAmount: 7500000, 
        status: 'active' 
      },
      { 
        programName: 'Bantuan Makanan untuk Keluarga Kurang Mampu', 
        description: 'Dukung keluarga yang membutuhkan akses makanan sehat dan bergizi', 
        targetAmount: 15000000, 
        collectedAmount: 5000000, 
        status: 'active' 
      },
      { 
        programName: 'Program Edukasi Gizi', 
        description: 'Edukasi masyarakat tentang pentingnya gizi seimbang untuk mencegah stunting', 
        targetAmount: 5000000, 
        collectedAmount: 2000000, 
        status: 'active' 
      },
    ]);
    console.log('✅ Donation data seeded');

    console.log('🎉 Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seed();
