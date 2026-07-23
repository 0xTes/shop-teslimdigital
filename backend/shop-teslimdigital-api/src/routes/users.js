const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');
const { requireAuth } = require('../middleware/auth');
const { addressValidator } = require('../middleware/validate');

router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, userController.updateProfile);
router.get('/addresses', requireAuth, addressController.getAddresses);
router.post('/addresses', requireAuth, addressValidator, addressController.createAddress);
router.put('/addresses/:addressId', requireAuth, addressValidator, addressController.updateAddress);
router.delete('/addresses/:addressId', requireAuth, addressController.deleteAddress);

module.exports = router;
