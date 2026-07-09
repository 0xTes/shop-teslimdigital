const { body } = require('express-validator');

exports.registerValidator = [
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email address'),
  body('phone').optional({ values: 'falsy' }).isMobilePhone('any').withMessage('Invalid phone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
];

exports.loginValidator = [
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email address'),
  body('phone').optional({ values: 'falsy' }).isString(),
  body('password').notEmpty().withMessage('Password is required')
];

exports.reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim(),
  body('body').optional().trim(),
  body('authorName').trim().notEmpty().withMessage('Name is required')
];

exports.orderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Cart is empty'),
  body('items.*.productId').isUUID().withMessage('Invalid product in cart'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Invalid quantity'),
  body('shipping.email').isEmail().withMessage('Valid email is required'),
  body('shipping.firstName').trim().notEmpty(),
  body('shipping.lastName').trim().notEmpty(),
  body('shipping.address').trim().notEmpty(),
  body('shipping.city').trim().notEmpty(),
  body('shipping.state').trim().notEmpty(),
  body('shipping.shippingMethod').isIn(['standard', 'express'])
];
