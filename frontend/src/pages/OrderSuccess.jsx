import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import { formatNaira } from '../utils/formatCurrency';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SEOMeta from '../components/SEO/SEOMeta';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const orderNumber = params.get('orderNumber');
  const email = params.get('email');
  const hasSession = Boolean(localStorage.getItem('token'));
  const canFetch = hasSession ? Boolean(orderId) : Boolean(orderNumber && email);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order-confirmation', orderId, orderNumber, email, hasSession],
    queryFn: async () => {
      if (hasSession) return (await api.get(`/orders/${orderId}`)).data;
      return (await api.get('/orders/lookup', { params: { orderNumber, email } })).data;
    },
    enabled: canFetch,
    retry: false
  });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <SEOMeta title="Order Confirmed" description="Your order has been placed successfully." noIndex />
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" aria-hidden="true" />
      <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
      {order ? <><p className="text-gray-600 mb-1">Order number: <span className="font-medium">{order.orderNumber}</span></p><p className="text-gray-600 mb-8">Total: <span className="font-medium">{formatNaira(order.total)}</span></p></> : <p className="text-gray-600 mb-8">Your order has been recorded. Keep the confirmation email to look it up later.</p>}
      {isError && <p role="alert" className="mb-6 text-sm text-amber-700">We could not retrieve the full order details, but your checkout request was accepted.</p>}
      <p className="text-gray-500 mb-8">We&apos;ve sent a confirmation email with your order details. We&apos;ll notify you when your order ships.</p>
      <div className="flex flex-wrap justify-center gap-3"><Link to="/shop" className="inline-block min-h-11 px-6 py-3 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg font-medium transition">Continue shopping</Link><Link to="/order-lookup" className="inline-block min-h-11 px-6 py-3 border border-gray-200 hover:border-brand-teal rounded-lg font-medium transition">Find an order</Link></div>
    </div>
  );
}
