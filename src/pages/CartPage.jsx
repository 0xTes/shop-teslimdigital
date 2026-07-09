import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatNaira } from '../utils/formatCurrency';
import CartLineItem from '../components/Cart/CartLineItem';
import SEOMeta from '../components/SEO/SEOMeta';

export default function CartPage() {
  const { items, totalPrice } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SEOMeta
        title="Your Cart"
        description="Review the items in your cart at Teslim Digital Shop."
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link
            to="/shop"
            className="inline-block min-h-11 px-6 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg font-medium transition"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <ul className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </ul>

          <div className="bg-white rounded-xl p-6 shadow-sm h-fit space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>{formatNaira(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              className="block text-center min-h-11 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg font-medium transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
