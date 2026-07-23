const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  label: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Home' },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  postalCode: { type: DataTypes.STRING, allowNull: true },
  isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  indexes: [{ fields: ['userId', 'isDefault'] }]
});

module.exports = Address;
