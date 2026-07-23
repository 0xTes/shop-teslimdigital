import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatNaira } from '../utils/formatCurrency';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SEOMeta from '../components/SEO/SEOMeta';

const nextStatuses = {
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const hasStoredToken = Boolean(localStorage.getItem('token'));
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const dashboard = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: async () => (await api.get('/admin/dashboard')).data, enabled: user?.role === 'admin' });
  const orders = useQuery({ queryKey: ['admin', 'orders'], queryFn: async () => (await api.get('/admin/orders?limit=20')).data, enabled: user?.role === 'admin' });

  if (!isAuthenticated && !hasStoredToken) return <Navigate to="/login" replace />;
  if (user && user.role !== 'admin') return <Navigate to="/" replace />;
  if (!user || dashboard.isLoading || orders.isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  const updateStatus = async (orderId, status) => {
    setError(''); setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status, ...(status === 'paid' ? { paymentStatus: 'paid' } : {}) });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }), queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })]);
    } catch (requestError) { setError(requestError.response?.data?.error || 'The order could not be updated.'); }
    finally { setUpdatingId(''); }
  };

  const metrics = [
    ['Orders', dashboard.data.orders], ['Pending work', dashboard.data.pendingOrders], ['Customers', dashboard.data.customers], ['Revenue', formatNaira(dashboard.data.revenue)]
  ];

  return <div className="max-w-7xl mx-auto px-4 py-8"><SEOMeta title="Admin Dashboard" description="Manage Teslim Digital Shop operations." noIndex /><div className="mb-8"><h1 className="text-3xl font-bold">Admin dashboard</h1><p className="mt-1 text-gray-600">Operations overview and protected order lifecycle controls.</p></div>{error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section><section className="mt-8 rounded-xl bg-white shadow-sm overflow-hidden"><div className="flex items-center justify-between border-b px-6 py-5"><h2 className="font-semibold">Recent orders</h2><span className="text-sm text-gray-500">Lifecycle actions are final and audited.</span></div>{orders.isError ? <p className="p-6 text-red-700">Orders could not be loaded.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-6 py-3 font-medium">Order</th><th className="px-6 py-3 font-medium">Customer</th><th className="px-6 py-3 font-medium">Total</th><th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium">Action</th></tr></thead><tbody className="divide-y">{orders.data.data.map((order) => <tr key={order.id}><td className="px-6 py-4 font-medium">{order.orderNumber}</td><td className="px-6 py-4">{order.email}</td><td className="px-6 py-4">{formatNaira(order.total)}</td><td className="px-6 py-4 capitalize">{order.status}</td><td className="px-6 py-4">{nextStatuses[order.status]?.length ? <select aria-label={`Update ${order.orderNumber} status`} value="" disabled={updatingId === order.id} onChange={(event) => { if (event.target.value) updateStatus(order.id, event.target.value); }} className="rounded border border-gray-200 bg-white px-2 py-2"><option value="">Move to…</option>{nextStatuses[order.status].map((status) => <option value={status} key={status}>{status}</option>)}</select> : <span className="text-gray-400">Final</span>}</td></tr>)}</tbody></table></div>}</section><p className="mt-6 text-sm text-gray-600">The protected admin API also provides product, category, deal, review, customer, and analytics management endpoints for the operational console.</p></div>;
}
