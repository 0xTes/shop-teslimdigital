const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, cartController.getCart);
router.put('/', requireAuth, cartController.syncCart);

module.exports = router;
