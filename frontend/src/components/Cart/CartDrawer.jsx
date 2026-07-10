import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { X, ShoppingBag } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useCart } from '../../hooks/useCart';
import { formatNaira } from '../../utils/formatCurrency';
import CartLineItem from "./CartItem";


export default function CartDrawer() {
  const isCartOpen = useUiStore((s) => s.isCartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const { items, totalPrice } = useCart();

  useEffect(() => {  
   if (!isCartOpen) return;

   document.body.style.overflow = "hidden";

   return () => {
      document.body.style.overflow = "";
      };
  }, [isCartOpen]);

   if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={closeCart}
      />

      <div className="relative bg-white w-full max-w-md h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              Your Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-brand-teal/40 outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="mt-10 text-center space-y-4">
              <p className="text-gray-500"> Your cart is empty. </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="inline-block rounded-lg bg-brand-teal px-5 py-2 text-white font-medium hover:bg-brand-teal-dark transition"> Continue Shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Subtotal</span>
              <span>{formatNaira(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full text-center min-h-11 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg font-medium transition"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
