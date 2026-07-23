const addColumnIfMissing = async (queryInterface, table, column, definition, transaction) => {
  const columns = await queryInterface.describeTable(table);
  if (!columns[column]) await queryInterface.addColumn(table, column, definition, { transaction });
};

const addIndexIfMissing = async (queryInterface, table, fields, name, transaction) => {
  const indexes = await queryInterface.showIndex(table);
  if (!indexes.some((index) => index.name === name)) {
    await queryInterface.addIndex(table, fields, { name, transaction });
  }
};

module.exports = {
  up: async (queryInterface, Sequelize, transaction) => {
    const { DataTypes } = Sequelize;
    await addColumnIfMissing(queryInterface, 'Orders', 'paymentProvider', { type: DataTypes.STRING, allowNull: true }, transaction);
    await addColumnIfMissing(queryInterface, 'Orders', 'paymentReference', { type: DataTypes.STRING, allowNull: true, unique: true }, transaction);
    await addColumnIfMissing(queryInterface, 'Orders', 'paidAt', { type: DataTypes.DATE, allowNull: true }, transaction);
    await addColumnIfMissing(queryInterface, 'Orders', 'cancelledAt', { type: DataTypes.DATE, allowNull: true }, transaction);
    await addColumnIfMissing(queryInterface, 'Orders', 'statusHistory', { type: DataTypes.JSONB, allowNull: false, defaultValue: [] }, transaction);
    await addIndexIfMissing(queryInterface, 'Orders', ['userId', 'createdAt'], 'orders_user_created_at', transaction);
    await addIndexIfMissing(queryInterface, 'Orders', ['email', 'orderNumber'], 'orders_email_order_number', transaction);
    await addIndexIfMissing(queryInterface, 'Orders', ['status', 'createdAt'], 'orders_status_created_at', transaction);

    const tables = await queryInterface.showAllTables();
    const tableNames = new Set(tables.map((table) => typeof table === 'string' ? table : table.tableName));
    if (!tableNames.has('Shippings')) {
      await queryInterface.createTable('Shippings', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        orderId: { type: DataTypes.UUID, allowNull: false, unique: true, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
        carrier: { type: DataTypes.STRING, allowNull: true },
        trackingNumber: { type: DataTypes.STRING, allowNull: true },
        trackingUrl: { type: DataTypes.STRING, allowNull: true },
        shippedAt: { type: DataTypes.DATE, allowNull: true },
        deliveredAt: { type: DataTypes.DATE, allowNull: true },
        providerMetadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
      }, { transaction });
    }
    await addIndexIfMissing(queryInterface, 'Shippings', ['carrier', 'trackingNumber'], 'shippings_carrier_tracking_number', transaction);

    if (!tableNames.has('Addresses')) {
      await queryInterface.createTable('Addresses', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        label: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Home' },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: false },
        city: { type: DataTypes.STRING, allowNull: false },
        state: { type: DataTypes.STRING, allowNull: false },
        postalCode: { type: DataTypes.STRING, allowNull: true },
        isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
      }, { transaction });
    }
    await addIndexIfMissing(queryInterface, 'Addresses', ['userId', 'isDefault'], 'addresses_user_default', transaction);

    await addColumnIfMissing(queryInterface, 'Reviews', 'authorName', { type: DataTypes.STRING, allowNull: true }, transaction);
  }
};
