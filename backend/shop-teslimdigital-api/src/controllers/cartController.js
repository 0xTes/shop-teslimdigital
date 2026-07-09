const { Cart, CartItem, Product } = require('../models');

// The storefront cart lives client-side (Zustand + localStorage) for guest
// checkout speed. These endpoints let a logged-in user's cart persist across
// devices — the frontend calls `syncCart` after login to push/merge the
// local cart, and `getCart` to restore it.

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.userId },
      include: [{ model: CartItem, as: 'items', include: [Product] }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId });
      cart = await Cart.findByPk(cart.id, {
        include: [{ model: CartItem, as: 'items', include: [Product] }]
      });
    }

    res.json(cart);
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ where: { userId: req.userId } });
    if (!cart) {
      cart = await Cart.create({ userId: req.userId });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    if (items.length) {
      await CartItem.bulkCreate(
        items.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity
        }))
      );
    }

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: 'items', include: [Product] }]
    });

    res.json(updatedCart);
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
};
