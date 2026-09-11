const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Nutrition = sequelize.define('Nutrition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('protein', 'carbohydrate', 'fat', 'vitamin', 'mineral'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  calories: {
    type: DataTypes.FLOAT,
  },
  protein: {
    type: DataTypes.FLOAT,
  },
  carbohydrate: {
    type: DataTypes.FLOAT,
  },
  fat: {
    type: DataTypes.FLOAT,
  },
  vitamins: {
    type: DataTypes.JSON,
  },
  minerals: {
    type: DataTypes.JSON,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  ageMin: {
    type: DataTypes.FLOAT,
  },
  ageMax: {
    type: DataTypes.FLOAT,
  },
  priceCategory: {
    type: DataTypes.ENUM('hemat', 'sedang', 'lengkap'),
    defaultValue: 'sedang',
  },
}, {
  tableName: 'nutritions',
  timestamps: true,
});

module.exports = Nutrition;
