import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatNaira } from '../utils/formatCurrency';
import CartLineItem from '../components/Cart/CartItem';
import SEOMeta from '../components/SEO/SEOMeta';

export default function CartPage() {
  const { items, totalPrice } = useCart();

  const isCartEmpty = items.length === 0;

  return (
    <>
      <SEOMeta
        title="Your Cart"
        description="Review the items in your cart at Teslim Digital Shop."
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">
          Your Cart
        </h1>

        {isCartEmpty ? (
          <div className="py-20 text-center">
            <p className="mb-6 text-gray-500">
              Your cart is empty.
            </p>

            <Link
              to="/shop"
              className="inline-block min-h-11 rounded-lg bg-brand-teal px-6 py-3 font-medium text-white transition hover:bg-brand-teal-dark"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">

            <ul className="space-y-4 rounded-xl bg-white p-6 shadow-sm md:col-span-2">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                />
              ))}
            </ul>

            <aside className="space-y-4 rounded-xl bg-white p-6 shadow-sm h-fit">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-lg font-semibold">
                  Subtotal
                </span>

                <span className="text-lg font-bold text-brand-teal">
                  {formatNaira(totalPrice)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="block rounded-lg bg-brand-teal py-3 text-center font-medium text-white transition hover:bg-brand-teal-dark"
              >
                Proceed to Checkout
              </Link>
            </aside>

          </div>
        )}
      </div>
    </>
  );
}