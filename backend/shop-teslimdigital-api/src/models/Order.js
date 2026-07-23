const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingMethod: {
    type: DataTypes.STRING,
    defaultValue: 'standard'
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'bank_transfer'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  paymentProvider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  statusHistory: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  }
}, {
  indexes: [
    { fields: ['userId', 'createdAt'] },
    { fields: ['email', 'orderNumber'] },
    { fields: ['status', 'createdAt'] }
  ]
});

module.exports = Order;
