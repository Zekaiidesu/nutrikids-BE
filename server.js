const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const { connectDB, sequelize } = require('./src/config/database');
require('./src/models/index');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NutriKids API Documentation',
}));

const userRoutes = require('./src/routes/userRoutes');
const childRoutes = require('./src/routes/childRoutes');
const nutritionRoutes = require('./src/routes/nutritionRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const educationRoutes = require('./src/routes/educationRoutes');
const mlRoutes = require('./src/routes/mlRoutes');

app.use('/api/users', userRoutes);
app.use('/api/children', childRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/ml', mlRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NutriKids API is running' });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: false });
  console.log('✅ Database synced');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api/docs`);
    console.log(`🤖 ML Service: ${process.env.ML_API_URL}`);
  });
};

startServer();
