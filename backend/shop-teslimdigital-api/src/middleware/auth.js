const jwt = require('jsonwebtoken');

// Requires a valid Bearer token. Attaches req.userId on success.
exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Attaches req.userId if a valid token is present, but never blocks the
// request. Used for endpoints that behave differently for guests vs. logged
// in users (e.g. placing an order).
exports.optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
  } catch (error) {
    // ignore invalid token for optional auth
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  const { User } = require('../models');
  User.findByPk(req.userId)
    .then((user) => {
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    })
    .catch(() => res.status(500).json({ error: 'Failed to verify admin access' }));
};
