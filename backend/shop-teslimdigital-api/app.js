const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/config/env');
const { sequelize } = require('./src/models');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/reviews', require('./src/routes/reviews'));
app.use('/api/deals', require('./src/routes/deals'));
app.use('/api/users', require('./src/routes/users'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(require('./src/middleware/errorHandler'));

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
