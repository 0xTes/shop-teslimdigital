const { Review, Product, Order, OrderItem } = require('../models');
const { validationResult } = require('express-validator');

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId },
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    const { rating, title, body, authorName } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // A review counts as a "verified purchase" if the logged-in user has a
    // delivered order containing this product.
    let isVerifiedPurchase = false;
    if (req.userId) {
      const purchase = await OrderItem.findOne({
        where: { productId },
        include: [{
          model: Order,
          where: { userId: req.userId, status: ['delivered', 'shipped', 'paid'] }
        }]
      });
      isVerifiedPurchase = !!purchase;
    }

    const review = await Review.create({
      productId,
      userId: req.userId || null,
      authorName,
      rating,
      title,
      body,
      isVerifiedPurchase
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};
