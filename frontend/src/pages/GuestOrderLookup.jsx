import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatNaira } from '../utils/formatCurrency';
import SEOMeta from '../components/SEO/SEOMeta';

const statusLabels = { pending: 'Pending', paid: 'Paid', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

export default function GuestOrderLookup() {
  const [form, setForm] = useState({ orderNumber: '', email: '' });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setOrder(null);
    setIsLoading(true);
    try {
      const { data } = await api.get('/orders/lookup', { params: form });
      setOrder(data);
    } catch (requestError) {
      setError(requestError.response?.status === 404 ? 'We could not find an order matching those details.' : 'Order lookup is temporarily unavailable.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <SEOMeta title="Find a Guest Order" description="Look up a Teslim Digital Shop guest order." noIndex />
      <h1 className="text-3xl font-bold">Find your order</h1>
      <p className="mt-2 text-gray-600">Enter the order number and email address used at checkout.</p>
      <form onSubmit={submit} className="mt-8 rounded-xl bg-white p-6 shadow-sm space-y-4">
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="block text-sm font-medium">Order number<input value={form.orderNumber} onChange={(event) => setForm({ ...form, orderNumber: event.target.value })} placeholder="TD-..." className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-teal" required /></label>
        <label className="block text-sm font-medium">Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-teal" required /></label>
        <button disabled={isLoading} className="min-h-11 w-full rounded-lg bg-brand-teal px-5 py-3 font-medium text-white transition hover:bg-brand-teal-dark disabled:opacity-50">{isLoading ? 'Looking up order…' : 'Find order'}</button>
      </form>

      {order && <section className="mt-8 rounded-xl bg-white p-6 shadow-sm" aria-live="polite"><div className="flex flex-wrap justify-between gap-4 border-b pb-4"><div><h2 className="font-semibold">{order.orderNumber}</h2><p className="text-sm text-gray-500">Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-brand-teal-light px-3 py-1 text-sm font-medium text-brand-teal-dark">{statusLabels[order.status] || order.status}</span></div><ul className="divide-y">{order.items?.map((item) => <li key={item.id} className="flex justify-between gap-3 py-4 text-sm"><span>{item.quantity} × {item.name}</span><span>{formatNaira(item.price * item.quantity)}</span></li>)}</ul><div className="flex justify-between border-t pt-4 font-bold"><span>Total</span><span>{formatNaira(order.total)}</span></div>{order.shipping?.trackingNumber && <p className="mt-5 text-sm text-gray-700">Tracking: {order.shipping.trackingUrl ? <a className="text-brand-teal underline" href={order.shipping.trackingUrl} target="_blank" rel="noopener noreferrer">{order.shipping.trackingNumber}</a> : order.shipping.trackingNumber}</p>}</section>}
      <p className="mt-8 text-sm text-gray-600">Have an account? <Link to="/login" className="font-medium text-brand-teal hover:underline">Log in</Link> to see your order history.</p>
    </div>
  );
}
