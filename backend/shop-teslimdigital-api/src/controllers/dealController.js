const { Deal, Product } = require('../models');
const { Op } = require('sequelize');

exports.getCurrentDeals = async (req, res) => {
  try {
    const now = new Date();
    
    const deals = await Deal.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now }
      },
      include: [{
        model: Product,
        where: { isActive: true },
        required: false
      }]
    });

    res.json(deals);
  } catch (error) {
    console.error('Fetch deals error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
};

exports.getDealProducts = async (req, res) => {
  try {
    const { dealId } = req.params;
    const deal = await Deal.findByPk(dealId, {
      include: [Product]
    });
    
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Calculate discounted prices
    const productsWithDiscounts = deal.Products.map(product => ({
      ...product.toJSON(),
      originalPrice: product.price,
      discountedPrice: (product.price * (1 - deal.discountPercent / 100)).toFixed(2),
      discountPercent: deal.discountPercent
    }));

    res.json({
      deal: deal.toJSON(),
      products: productsWithDiscounts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal products' });
  }
};