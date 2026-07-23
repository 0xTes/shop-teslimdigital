const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const {
  sequelize, Order, OrderItem, Product, Category, Deal, Review, User, Shipping
} = require('../models');
const { transitionOrder } = require('../services/orderLifecycleService');
const emailService = require('../services/emailService');

const pageFromQuery = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 25, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
};

const paginated = (res, result, { page, limit }) => res.json({
  data: result.rows,
  pagination: {
    page,
    limit,
    total: result.count,
    totalPages: Math.ceil(result.count / limit)
  }
});

const slugify = (value) => value.toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const pick = (source, keys) => keys.reduce((result, key) => {
  if (Object.prototype.hasOwnProperty.call(source, key)) result[key] = source[key];
  return result;
}, {});

exports.getDashboard = async (req, res, next) => {
  try {
    const [orders, customers, products, pendingOrders, revenue] = await Promise.all([
      Order.count(),
      User.count({ where: { role: 'customer' } }),
      Product.count(),
      Order.count({ where: { status: { [Op.in]: ['pending', 'paid', 'processing'] } } }),
      Order.sum('total', { where: { status: { [Op.ne]: 'cancelled' } } })
    ]);
    res.json({ orders, customers, products, pendingOrders, revenue: Number(revenue || 0) });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = pageFromQuery(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus;
    if (req.query.search?.trim()) {
      const value = `%${req.query.search.trim()}%`;
      where[Op.or] = [{ orderNumber: { [Op.iLike]: value } }, { email: { [Op.iLike]: value } }];
    }
    const result = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items' }, { model: Shipping, as: 'shipping' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true
    });
    paginated(res, result, { page, limit });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [{ model: OrderItem, as: 'items' }, { model: Shipping, as: 'shipping' }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    await transitionOrder({
      order,
      status: req.body.status,
      paymentStatus: req.body.paymentStatus,
      actorId: req.userId,
      transaction
    });

    if (order.status === 'cancelled') {
      await Promise.all(order.items.map((item) => Product.increment(
        'inventory', { by: item.quantity, where: { id: item.productId }, transaction }
      )));
    }

    let shipping = order.shipping;
    if (order.status === 'shipped') {
      [shipping] = await Shipping.findOrCreate({
        where: { orderId: order.id },
        defaults: { orderId: order.id, shippedAt: new Date() },
        transaction
      });
      if (!shipping.shippedAt) await shipping.update({ shippedAt: new Date() }, { transaction });
    }
    if (order.status === 'delivered') {
      [shipping] = await Shipping.findOrCreate({
        where: { orderId: order.id },
        defaults: { orderId: order.id, deliveredAt: new Date() },
        transaction
      });
      if (!shipping.deliveredAt) await shipping.update({ deliveredAt: new Date() }, { transaction });
    }

    await transaction.commit();

    if (order.status === 'shipped') emailService.sendShippingNotification(order, shipping).catch(() => {});
    if (order.status === 'delivered') emailService.sendDeliveryNotification(order).catch(() => {});

    return res.json({ order, shipping });
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
};

exports.updateShipping = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'cancelled') return res.status(422).json({ error: 'A cancelled order cannot be shipped' });

    const data = pick(req.body, ['carrier', 'trackingNumber', 'trackingUrl', 'shippedAt', 'deliveredAt']);
    const [shipping] = await Shipping.findOrCreate({ where: { orderId: order.id }, defaults: { orderId: order.id } });
    await shipping.update(data);
    return res.json(shipping);
  } catch (error) {
    return next(error);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const { page, limit, offset } = pageFromQuery(req.query);
    const where = { role: 'customer' };
    if (req.query.search?.trim()) {
      const value = `%${req.query.search.trim()}%`;
      where[Op.or] = [{ email: { [Op.iLike]: value } }, { phone: { [Op.iLike]: value } }];
    }
    const result = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    paginated(res, result, { page, limit });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit, offset } = pageFromQuery(req.query);
    const result = await Product.findAndCountAll({
      include: [Category], order: [['createdAt', 'DESC']], limit, offset, distinct: true
    });
    paginated(res, result, { page, limit });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const data = pick(req.body, [
      'name', 'slug', 'description', 'price', 'compareAtPrice', 'images', 'inventory',
      'isActive', 'isFeatured', 'categoryId', 'tags', 'metadata'
    ]);
    if (!data.name || data.price === undefined || !data.categoryId) {
      return res.status(400).json({ error: 'name, price and categoryId are required' });
    }
    data.slug = data.slug || slugify(data.name);
    const category = await Category.findByPk(data.categoryId);
    if (!category) return res.status(422).json({ error: 'Category not found' });
    const product = await Product.create(data);
    return res.status(201).json(product);
  } catch (error) { return next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const data = pick(req.body, [
      'name', 'slug', 'description', 'price', 'compareAtPrice', 'images', 'inventory',
      'isActive', 'isFeatured', 'categoryId', 'tags', 'metadata'
    ]);
    if (data.categoryId && !(await Category.findByPk(data.categoryId))) {
      return res.status(422).json({ error: 'Category not found' });
    }
    if (data.name && !data.slug) data.slug = slugify(data.name);
    await product.update(data);
    return res.json(product);
  } catch (error) { return next(error); }
};

exports.getCategories = async (req, res, next) => {
  try { res.json(await Category.findAll({ order: [['name', 'ASC']] })); } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const data = pick(req.body, ['name', 'slug', 'description', 'image', 'parentId']);
    if (!data.name) return res.status(400).json({ error: 'name is required' });
    data.slug = data.slug || slugify(data.name);
    if (data.parentId && !(await Category.findByPk(data.parentId))) {
      return res.status(422).json({ error: 'Parent category not found' });
    }
    return res.status(201).json(await Category.create(data));
  } catch (error) { return next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const data = pick(req.body, ['name', 'slug', 'description', 'image', 'parentId']);
    if (data.name && !data.slug) data.slug = slugify(data.name);
    await category.update(data);
    return res.json(category);
  } catch (error) { return next(error); }
};

const saveDealProducts = async (deal, productIds, transaction) => {
  if (!Array.isArray(productIds)) return;
  const products = await Product.findAll({ where: { id: productIds }, transaction });
  if (products.length !== productIds.length) {
    const error = new Error('One or more products do not exist');
    error.status = 422;
    throw error;
  }
  await deal.setProducts(products, { transaction });
  await deal.update({ productIds }, { transaction });
};

exports.getDeals = async (req, res, next) => {
  try { res.json(await Deal.findAll({ include: [Product], order: [['startDate', 'DESC']] })); } catch (error) { next(error); }
};

exports.createDeal = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const data = pick(req.body, ['title', 'description', 'discountPercent', 'startDate', 'endDate', 'isActive', 'bannerImage']);
    if (!data.title || data.discountPercent === undefined || !data.startDate || !data.endDate) {
      await transaction.rollback();
      return res.status(400).json({ error: 'title, discountPercent, startDate and endDate are required' });
    }
    const deal = await Deal.create(data, { transaction });
    await saveDealProducts(deal, req.body.productIds, transaction);
    await transaction.commit();
    return res.status(201).json(await Deal.findByPk(deal.id, { include: [Product] }));
  } catch (error) { await transaction.rollback(); return next(error); }
};

exports.updateDeal = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const deal = await Deal.findByPk(req.params.dealId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!deal) { await transaction.rollback(); return res.status(404).json({ error: 'Deal not found' }); }
    await deal.update(pick(req.body, ['title', 'description', 'discountPercent', 'startDate', 'endDate', 'isActive', 'bannerImage']), { transaction });
    await saveDealProducts(deal, req.body.productIds, transaction);
    await transaction.commit();
    return res.json(await Deal.findByPk(deal.id, { include: [Product] }));
  } catch (error) { await transaction.rollback(); return next(error); }
};

exports.getReviews = async (req, res, next) => {
  try {
    res.json(await Review.findAll({
      include: [Product, { model: User, attributes: { exclude: ['password'] } }],
      order: [['createdAt', 'DESC']]
    }));
  } catch (error) { next(error); }
};
