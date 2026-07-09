import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import { formatNaira } from '../utils/formatCurrency';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SEOMeta from '../components/SEO/SEOMeta';

export default function OrderSuccess() {
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <SEOMeta title="Order Confirmed" description="Your order has been placed successfully." url="" />
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" aria-hidden="true" />
      <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
      {order && (
        <>
          <p className="text-gray-600 mb-1">Order number: <span className="font-medium">{order.orderNumber}</span></p>
          <p className="text-gray-600 mb-8">Total: <span className="font-medium">{formatNaira(order.total)}</span></p>
        </>
      )}
      <p className="text-gray-500 mb-8">
        We've sent a confirmation email with your order details. We'll notify you when your order ships.
      </p>
      <Link
        to="/shop"
        className="inline-block min-h-11 px-6 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg font-medium transition"
      >
        Continue shopping
      </Link>
    </div>
  );
}
