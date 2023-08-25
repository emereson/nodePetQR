const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const GenerateQr = db.define('generateQr', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  userUuId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = GenerateQr;
