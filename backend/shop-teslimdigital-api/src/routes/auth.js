const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../middleware/validate');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
