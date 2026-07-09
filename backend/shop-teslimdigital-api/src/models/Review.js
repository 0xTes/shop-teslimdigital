// models/Review.js
const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
  isVerifiedPurchase: { type: DataTypes.BOOLEAN, defaultValue: false }
});