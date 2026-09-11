const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('malnutrisi', 'gizi-dasar', 'berdasarkan-usia', 'pencegahan', 'tips-sehat'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
  },
  ageMin: {
    type: DataTypes.FLOAT,
  },
  ageMax: {
    type: DataTypes.FLOAT,
  },
  tags: {
    type: DataTypes.JSON,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'educations',
  timestamps: true,
});

module.exports = Education;
