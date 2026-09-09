const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./src/routes/userRoutes');
const childRoutes = require('./src/routes/childRoutes');
const nutritionRoutes = require('./src/routes/nutritionRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const educationRoutes = require('./src/routes/educationRoutes');

app.use('/api/users', userRoutes);
app.use('/api/children', childRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/education', educationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NutriKids API is running' });
});

// Connect to MongoDB
const connectDB = require('./src/config/database');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
