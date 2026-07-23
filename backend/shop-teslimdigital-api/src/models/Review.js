// models/Review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  authorName: { type: DataTypes.STRING, allowNull: false },
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
  isVerifiedPurchase: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Review;
