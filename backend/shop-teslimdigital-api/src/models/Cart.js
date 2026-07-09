const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Server-side cart, used to persist a logged-in user's cart across devices.
// The storefront primarily relies on the Zustand + localStorage cart for
// guest checkout speed; this table lets us sync/restore it once a user logs in.
const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  }
});

module.exports = Cart;
