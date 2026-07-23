import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { formatNaira } from '../utils/formatCurrency';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SEOMeta from '../components/SEO/SEOMeta';

const STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const hasStoredToken = Boolean(localStorage.getItem('token'));

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/orders/mine');
      return data;
    },
    enabled: isAuthenticated
  });

  if (!isAuthenticated && !hasStoredToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SEOMeta title="My Profile" description="View your account and order history." url="" />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          Hi, {user?.firstName || 'there'}
        </h1>
        <button
          onClick={logout}
          className="min-h-11 px-4 py-2 border border-gray-200 rounded-lg hover:border-red-400 hover:text-red-500 transition"
        >
          Log out
        </button>
      </div>

      <section className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="font-semibold mb-2">Account details</h2>
        <p className="text-gray-600 text-sm">{user?.email || user?.phone}</p>
      </section>

      <section aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="font-semibold mb-4">Order history</h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} · {STATUS_LABELS[order.status] || order.status}
                  </p>
                </div>
                <p className="font-semibold">{formatNaira(order.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
