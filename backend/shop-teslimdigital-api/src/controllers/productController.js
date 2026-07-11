const { Op } = require('sequelize');
const { Product, Category } = require('../models');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const offset = (currentPage - 1) * pageSize;
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
      limit: pageSize,
      offset,
      include: [Category]
    });

    res.json({
      products,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 100);
    const products = await Product.findAll({
      where: { isActive: true, isFeatured: true },
      include: [Category],
      order: [['createdAt', 'DESC']],
      limit
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { productId, categoryId } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 4, 1), 100);
    let resolvedCategoryId = categoryId;

    if (!resolvedCategoryId && productId) {
      const product = await Product.findByPk(productId, { attributes: ['categoryId'] });
      resolvedCategoryId = product?.categoryId;
    }

    if (!resolvedCategoryId) {
      return res.json([]);
    }

    const where = { isActive: true, categoryId: resolvedCategoryId };
    if (productId) {
      where.id = { [Op.ne]: productId };
    }

    const products = await Product.findAll({
      where,
      include: [Category],
      order: [['createdAt', 'DESC']],
      limit
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [Category]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};
