import { Minus, Plus, X } from 'lucide-react';
import { formatNaira } from '../../utils/formatCurrency';
import { useCartStore } from '../../stores/cartStore';

export default function CartLineItem({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <li className="flex gap-4 py-4 border-b border-gray-100">
      <img
        src={item.images?.[0] ?? "/placeholder-product.png"}
        alt={item.name}
        className="w-20 h-20 rounded-lg object-cover bg-gray-50 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">{item.name}</p>

        <p className="text-brand-teal font-semibold">{formatNaira(item.price)}</p>

        <p className="mt-1 text-sm text-gray-500">Total: {formatNaira(item.price * item.quantity)}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            aria-label={`Decrease quantity of ${item.name}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-brand-teal focus:ring-2 focus:ring-brand-teal/40 outline-none"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center" aria-live="polite">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.name}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-brand-teal focus:ring-2 focus:ring-brand-teal/40 outline-none"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 focus:ring-2 focus:ring-red-300 outline-none rounded-lg flex-shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </li>
  );
}
