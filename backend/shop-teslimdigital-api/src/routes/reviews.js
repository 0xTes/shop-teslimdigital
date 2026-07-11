const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/auth');
const { reviewValidator } = require('../middleware/validate');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/product/:productId', optionalAuth, reviewValidator, reviewController.createReview);

module.exports = router;
