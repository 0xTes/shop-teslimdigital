const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password, firstName, lastName } = req.body;

    // Must provide either email OR phone
    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Please provide either an email or phone number' 
      });
    }

    // Check if user exists
    const whereClause = email ? { email } : { phone };
    const existingUser = await User.findOne({ where: whereClause });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Account already exists with this email/phone' 
      });
    }

    const user = await User.create({
      email: email || null,
      phone: phone || null,
      password,
      firstName,
      lastName
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ 
        error: 'Please provide either email or phone' 
      });
    }

    const whereClause = email ? { email } : { phone };
    const user = await User.findOne({ where: whereClause });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await User.findOne({ where: { email: req.body.email.toLowerCase() } });
    // Always return the same response, so this endpoint cannot enumerate accounts.
    if (user) {
      const token = jwt.sign({
        userId: user.id,
        purpose: 'password_reset',
        passwordHash: user.password
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
      emailService.sendPasswordReset({
        email: user.email,
        firstName: user.firstName,
        resetUrl: `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`
      }).catch(() => {});
    }
    return res.json({ message: 'If an account exists, a password reset link has been sent.' });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to request password reset' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }
    const user = await User.findByPk(decoded.userId);
    if (!user || decoded.passwordHash !== user.password) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }
    await user.update({ password: req.body.password });
    return res.json({ message: 'Password updated. You can now log in.' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired password reset token' });
  }
};
