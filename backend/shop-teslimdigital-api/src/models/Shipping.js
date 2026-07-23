const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Shipping remains a separate record so carrier integrations can be added
// without widening the order aggregate or exposing provider-specific fields.
const Shipping = sequelize.define('Shipping', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  carrier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trackingUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true }
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  providerMetadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  }
}, {
  indexes: [{ fields: ['carrier', 'trackingNumber'] }]
});

module.exports = Shipping;
