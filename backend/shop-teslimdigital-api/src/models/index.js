const sequelize = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Deal = require('./Deal');
const Review = require('./Review');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Shipping = require('./Shipping');
const Address = require('./Address');

// ---- Category <-> Product ----
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });

// ---- Product <-> Review ----
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// ---- Deal <-> Product (many-to-many through a join table) ----
Deal.belongsToMany(Product, { through: 'DealProducts', timestamps: false });
Product.belongsToMany(Deal, { through: 'DealProducts', timestamps: false });

// ---- User <-> Order ----
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// ---- Order <-> Shipping ----
Order.hasOne(Shipping, { foreignKey: 'orderId', as: 'shipping', onDelete: 'CASCADE' });
Shipping.belongsTo(Order, { foreignKey: 'orderId' });

// ---- User <-> Address ----
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId' });

// ---- User <-> Cart ----
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Deal,
  Review,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Shipping,
  Address
};
