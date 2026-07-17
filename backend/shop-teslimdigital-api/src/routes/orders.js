const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { orderValidator } = require('../middleware/validate');

// Checkout works for guests as well as logged-in users.
router.post('/', optionalAuth, orderValidator, orderController.createOrder);
router.get('/mine', requireAuth, orderController.getMyOrders);
// Guest order lookup (must come before '/:orderId')
router.get('/lookup', orderController.lookupGuestOrder);
router.get('/:orderId', requireAuth, orderController.getOrder);

module.exports = router;
