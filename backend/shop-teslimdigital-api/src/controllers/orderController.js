const { validationResult } = require('express-validator');
const { sequelize, Order, OrderItem, Product } = require('../models');
const shippingService = require('../services/shippingService');
const emailService = require('../services/emailService');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TD-${timestamp}-${random}`;
};

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { items, shipping } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Re-fetch products server-side — never trust client-supplied prices.
    const productIds = items.map((i) => i.productId);
    const products = await Product.findAll({
      where: { id: productIds, isActive: true },
      transaction
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        await transaction.rollback();
        return res.status(400).json({ error: `Product ${item.productId} is unavailable` });
      }
      if (product.inventory < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const lineTotal = parseFloat(product.price) * item.quantity;
      subtotal += lineTotal;

      orderItemsData.push({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || null,
        price: product.price,
        quantity: item.quantity
      });
    }

    const shippingCost = shippingService.calculateShippingCost(shipping.shippingMethod, subtotal);
    const total = subtotal + shippingCost;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.userId || null,
      email: shipping.email,
      phone: shipping.phone,
      subtotal,
      shippingCost,
      total,
      shippingMethod: shipping.shippingMethod,
      shippingAddress: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        postalCode: shipping.postalCode || null
      }
    }, { transaction });

    await OrderItem.bulkCreate(
      orderItemsData.map((item) => ({ ...item, orderId: order.id })),
      { transaction }
    );

    // Decrement inventory
    for (const item of items) {
      const product = productMap.get(item.productId);
      await product.decrement('inventory', { by: item.quantity, transaction });
    }

    await transaction.commit();

    // Send confirmation email best-effort, after commit, so a slow/broken
    // SMTP server never rolls back a valid order.
    emailService.sendOrderConfirmation(
      order,
      { email: shipping.email }
    ).catch(() => {});

    res.status(201).json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
