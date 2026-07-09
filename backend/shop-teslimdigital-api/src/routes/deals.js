const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');

router.get('/current', dealController.getCurrentDeals);
router.get('/:dealId/products', dealController.getDealProducts);

module.exports = router;
