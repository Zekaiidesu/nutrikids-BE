const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  programName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  collectedAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active',
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'donations',
  timestamps: true,
});

module.exports = Donation;
