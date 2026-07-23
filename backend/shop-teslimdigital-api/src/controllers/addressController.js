const { validationResult } = require('express-validator');
const { sequelize, Address } = require('../models');

const addressFields = [
  'label', 'firstName', 'lastName', 'phone', 'address', 'city', 'state', 'postalCode', 'isDefault'
];

const pick = (source) => addressFields.reduce((result, key) => {
  if (Object.prototype.hasOwnProperty.call(source, key)) result[key] = source[key];
  return result;
}, {});

const setDefaultIfNeeded = async (userId, data, transaction) => {
  if (data.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId }, transaction });
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    res.json(await Address.findAll({ where: { userId: req.userId }, order: [['isDefault', 'DESC'], ['createdAt', 'DESC']] }));
  } catch (error) { next(error); }
};

exports.createAddress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const transaction = await sequelize.transaction();
  try {
    const data = pick(req.body);
    const hasAddresses = await Address.count({ where: { userId: req.userId }, transaction });
    if (hasAddresses === 0) data.isDefault = true;
    await setDefaultIfNeeded(req.userId, data, transaction);
    const address = await Address.create({ ...data, userId: req.userId }, { transaction });
    await transaction.commit();
    return res.status(201).json(address);
  } catch (error) { await transaction.rollback(); return next(error); }
};

exports.updateAddress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const transaction = await sequelize.transaction();
  try {
    const address = await Address.findOne({ where: { id: req.params.addressId, userId: req.userId }, transaction, lock: transaction.LOCK.UPDATE });
    if (!address) { await transaction.rollback(); return res.status(404).json({ error: 'Address not found' }); }
    const data = pick(req.body);
    await setDefaultIfNeeded(req.userId, data, transaction);
    await address.update(data, { transaction });
    await transaction.commit();
    return res.json(address);
  } catch (error) { await transaction.rollback(); return next(error); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.addressId, userId: req.userId } });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    await address.destroy();
    return res.status(204).end();
  } catch (error) { return next(error); }
};
