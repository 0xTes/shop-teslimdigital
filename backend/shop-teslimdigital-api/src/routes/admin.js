const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { orderStatusValidator, shippingValidator } = require('../middleware/validate');

router.use(requireAuth, requireAdmin);

router.get('/dashboard', admin.getDashboard);
router.get('/orders', admin.getOrders);
router.patch('/orders/:orderId/status', orderStatusValidator, admin.updateOrderStatus);
router.patch('/orders/:orderId/shipping', shippingValidator, admin.updateShipping);
router.get('/customers', admin.getCustomers);

router.get('/products', admin.getProducts);
router.post('/products', admin.createProduct);
router.patch('/products/:productId', admin.updateProduct);

router.get('/categories', admin.getCategories);
router.post('/categories', admin.createCategory);
router.patch('/categories/:categoryId', admin.updateCategory);

router.get('/deals', admin.getDeals);
router.post('/deals', admin.createDeal);
router.patch('/deals/:dealId', admin.updateDeal);
router.get('/reviews', admin.getReviews);

module.exports = router;
