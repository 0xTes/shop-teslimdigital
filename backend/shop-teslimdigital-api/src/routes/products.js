const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Order matters: specific paths before the generic '/:slug' style routes.
router.get('/featured', productController.getFeaturedProducts);
router.get('/related', productController.getRelatedProducts);
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
