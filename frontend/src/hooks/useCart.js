import { useCartStore } from '../stores/cartStore';

// Thin convenience wrapper exposing derived cart totals alongside actions.
export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice()
  };
}
