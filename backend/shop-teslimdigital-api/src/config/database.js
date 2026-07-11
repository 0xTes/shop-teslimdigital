const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(
  env.databaseUrl,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: env.nodeEnv === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

module.exports = sequelize;
