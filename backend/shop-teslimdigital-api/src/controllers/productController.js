const { Op } = require('sequelize');
const { Product } = require('../models');

exports.getProducts = async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;

  const where = { isActive: true };
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { tags: { [Op.contains]: [search] } }
    ];
  }
  
  if (category) {
    where.categoryId = category;
  }

  const order = [];
  switch (sort) {
    case 'price-asc': order.push(['price', 'ASC']); break;
    case 'price-desc': order.push(['price', 'DESC']); break;
    case 'name': order.push(['name', 'ASC']); break;
    default: order.push(['createdAt', 'DESC']);
  }

  const { count, rows: products } = await Product.findAndCountAll({
    where,
    order,
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [Category]
  });

  res.json({
    products,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  });
};