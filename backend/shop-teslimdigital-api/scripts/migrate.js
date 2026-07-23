const fs = require('fs');
const path = require('path');
const { sequelize } = require('../src/models');

const migrate = async () => {
  await sequelize.authenticate();
  // Creates only tables that do not exist. It intentionally does not alter
  // existing Railway tables; tracked migrations handle additive changes.
  await sequelize.sync();

  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.createTable('SequelizeMeta', {
    name: { type: require('sequelize').DataTypes.STRING, allowNull: false, primaryKey: true },
    appliedAt: { type: require('sequelize').DataTypes.DATE, allowNull: false }
  }).catch(async (error) => {
    if (!/already exists/i.test(error.message)) throw error;
  });

  const applied = await sequelize.query('SELECT "name" FROM "SequelizeMeta"', {
    type: require('sequelize').QueryTypes.SELECT
  });
  const appliedNames = new Set(applied.map((row) => row.name));
  const migrationsPath = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsPath).filter((file) => file.endsWith('.js')).sort();

  for (const file of files) {
    if (appliedNames.has(file)) continue;
    const migration = require(path.join(migrationsPath, file));
    const transaction = await sequelize.transaction();
    try {
      await migration.up(queryInterface, require('sequelize'), transaction);
      await queryInterface.bulkInsert('SequelizeMeta', [{ name: file, appliedAt: new Date() }], { transaction });
      await transaction.commit();
      console.log(`Applied migration ${file}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

migrate()
  .then(() => sequelize.close())
  .catch(async (error) => {
    console.error('Migration failed:', error);
    await sequelize.close();
    process.exitCode = 1;
  });
