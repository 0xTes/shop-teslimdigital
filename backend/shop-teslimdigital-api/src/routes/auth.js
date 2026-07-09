const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../middleware/validators');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
