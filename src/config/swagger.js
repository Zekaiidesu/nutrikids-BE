const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NutriKids API Documentation',
      version: '1.0.0',
      description: 'API untuk platform NutriKids - Solusi Cegah Stunting & Malnutrisi pada Anak',
      contact: { name: 'Tim NutriKids - OR 15 UKM Neo Telemetri' },
    },
    servers: [
      { url: 'http://localhost:5001', description: 'Development Server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Cek status API' },
      { name: 'Users', description: 'Manajemen user' },
      { name: 'Children', description: 'Manajemen data anak' },
      { name: 'Nutrition', description: 'Data gizi & rekomendasi' },
      { name: 'Donations', description: 'Program donasi' },
      { name: 'Education', description: 'Artikel edukasi' },
      { name: 'ML', description: 'Machine Learning - Prediksi Status Gizi' },
    ],
  },
  apis: [
    './src/routes/userRoutes.js',
    './src/routes/childRoutes.js',
    './src/routes/nutritionRoutes.js',
    './src/routes/donationRoutes.js',
    './src/routes/educationRoutes.js',
    './src/routes/mlRoutes.js',
  ],
};

module.exports = swaggerJsdoc(options);
