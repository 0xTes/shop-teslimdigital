import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatNaira } from '../../utils/formatCurrency';
import { useCartStore } from '../../stores/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
      <Link to={`/products/${product.slug ?? product.id}`} className="block focus:outline-none focus:ring-2 focus:ring-brand-teal rounded-t-xl">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <img
            src={product.images?.[0] ?? "/placeholder-product.png"}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {product.inventory === 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <Link to={`/products/${product.slug ?? product.id}`} className="focus:outline-none focus:ring-2 focus:ring-brand-teal rounded">
          <h3 className="font-medium text-slate-900 line-clamp-2">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-bold text-brand-teal">{formatNaira(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">{formatNaira(product.compareAtPrice)}</span>
          )}
        </div>

        <button
          onClick={() => {
            if (product.inventory > 0) {
              addItem(product, 1);
            }
          }}
          disabled={product.inventory === 0}
          className="w-full min-h-11 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition focus:ring-2 focus:ring-brand-teal/40 outline-none"
        >
          {product.inventory > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
