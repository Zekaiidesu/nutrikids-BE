const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NutriKids API Documentation',
      version: '1.0.0',
      description: `
        API untuk platform NutriKids - Solusi Cegah Stunting & Malnutrisi pada Anak
        
        ## Fitur Utama:
        - 👤 Manajemen User (Register, Login, Profil)
        - 👶 Manajemen Data Anak & Pemantauan Pertumbuhan
        - 🧮 Cek Status Gizi & Prediksi Stunting
        - 🍱 Rekomendasi Makanan Bergizi
        - ❤️ Program Donasi
        - 📚 Edukasi & Pencegahan Stunting
      `,
      contact: {
        name: 'Tim NutriKids - OR 15 UKM Neo Telemetri',
        email: 'nutrikids@neotelemetri.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development Server',
      },
      {
        url: 'https://api.nutrikids.com',
        description: 'Production Server (Coming Soon)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan token JWT yang didapat dari login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '67c8a1b2c3d4e5f6g7h8i9j0' },
            name: { type: 'string', example: 'Budi Santoso' },
            email: { type: 'string', example: 'budi@email.com' },
            role: { type: 'string', enum: ['user', 'admin', 'kader'], example: 'user' },
            phone: { type: 'string', example: '081234567890' },
            address: { type: 'string', example: 'Jl. Merdeka No. 10, Jakarta' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Child: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string', example: 'Ahmad Fauzi' },
            nickname: { type: 'string', example: 'Adit' },
            gender: { type: 'string', enum: ['Laki-laki', 'Perempuan'] },
            birthDate: { type: 'string', format: 'date' },
            growthHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date-time' },
                  weight: { type: 'number', example: 18 },
                  height: { type: 'number', example: 105 },
                  bmi: { type: 'number', example: 16.33 },
                  status: { type: 'string', example: 'Gizi Kurang' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        Nutrition: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Telur' },
            category: { type: 'string', enum: ['protein', 'carbohydrate', 'fat', 'vitamin', 'mineral'] },
            description: { type: 'string' },
            calories: { type: 'number', example: 155 },
            protein: { type: 'number', example: 13 },
            carbohydrate: { type: 'number', example: 1.1 },
            fat: { type: 'number', example: 11 },
            vitamins: { type: 'array', items: { type: 'string' } },
            minerals: { type: 'array', items: { type: 'string' } },
            recommendedAge: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
              },
            },
            priceCategory: { type: 'string', enum: ['hemat', 'sedang', 'lengkap'] },
          },
        },
        Donation: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            programName: { type: 'string', example: 'Paket Makan Bergizi Anak' },
            description: { type: 'string' },
            targetAmount: { type: 'number', example: 10000000 },
            collectedAmount: { type: 'number', example: 7500000 },
            status: { type: 'string', enum: ['active', 'completed', 'cancelled'] },
            donors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  amount: { type: 'number' },
                  date: { type: 'string', format: 'date-time' },
                  message: { type: 'string' },
                  isAnonymous: { type: 'boolean' },
                },
              },
            },
          },
        },
        Education: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Apa itu Stunting?' },
            category: { type: 'string', enum: ['malnutrisi', 'gizi-dasar', 'berdasarkan-usia', 'pencegahan', 'tips-sehat'] },
            content: { type: 'string' },
            summary: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            views: { type: 'number', example: 0 },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Budi Santoso' },
            email: { type: 'string', example: 'budi@email.com' },
            password: { type: 'string', example: '123456', minLength: 6 },
            phone: { type: 'string', example: '081234567890' },
            address: { type: 'string', example: 'Jl. Merdeka No. 10, Jakarta' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'budi@email.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        NutritionCheckInput: {
          type: 'object',
          required: ['weight', 'height', 'age', 'gender'],
          properties: {
            weight: { type: 'number', example: 18, description: 'Berat badan dalam kg' },
            height: { type: 'number', example: 105, description: 'Tinggi badan dalam cm' },
            age: { type: 'number', example: 5, description: 'Usia dalam tahun' },
            gender: { type: 'string', enum: ['Laki-laki', 'Perempuan'] },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Cek status API' },
      { name: 'Users', description: 'Manajemen user (auth & profil)' },
      { name: 'Children', description: 'Manajemen data anak & pemantauan' },
      { name: 'Nutrition', description: 'Data gizi & rekomendasi makanan' },
      { name: 'Donations', description: 'Program donasi & transaksi' },
      { name: 'Education', description: 'Artikel edukasi & pencegahan' },
    ],
  },
  apis: ['./src/routes/userRoutes.js', './src/routes/childRoutes.js', './src/routes/nutritionRoutes.js', './src/routes/donationRoutes.js', './src/routes/educationRoutes.js'],
};

module.exports = swaggerJsdoc(options);
