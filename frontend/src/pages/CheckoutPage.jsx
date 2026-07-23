import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import { formatNaira } from '../utils/formatCurrency';
import SEOMeta from '../components/SEO/SEOMeta';

const shippingPrices = { standard: 2500, express: 5000 };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: user?.email || '', phone: user?.phone || '', firstName: user?.firstName || '',
    lastName: user?.lastName || '', address: '', city: '', state: '', postalCode: '',
    shippingMethod: 'standard'
  });

  const subtotal = Number(getTotalPrice());
  const shippingCost = shippingPrices[formData.shippingMethod];
  const total = subtotal + shippingCost;

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const update = (field) => (event) => setFormData((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        shipping: formData,
        paymentMethod: 'bank_transfer',
        paymentProvider: 'manual'
      });
      clearCart();
      const params = new URLSearchParams({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        email: formData.email
      });
      navigate(`/order-success?${params.toString()}`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SEOMeta title="Checkout" description="Securely complete your Teslim Digital Shop order." noIndex />
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-gray-600 mb-8">Guest checkout is available. Your order details are protected by your email address.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6" noValidate>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="font-semibold mb-4">Contact information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm font-medium">Email
                <input type="email" value={formData.email} onChange={update('email')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none" required />
              </label>
              <label className="text-sm font-medium">Phone
                <input type="tel" value={formData.phone} onChange={update('phone')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none" required />
              </label>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="address-heading">
            <h2 id="address-heading" className="font-semibold mb-4">Shipping address</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm font-medium">First name<input value={formData.firstName} onChange={update('firstName')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required /></label>
                <label className="text-sm font-medium">Last name<input value={formData.lastName} onChange={update('lastName')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required /></label>
              </div>
              <label className="text-sm font-medium block">Address<input value={formData.address} onChange={update('address')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required /></label>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="text-sm font-medium">City<input value={formData.city} onChange={update('city')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required /></label>
                <label className="text-sm font-medium">State<input value={formData.state} onChange={update('state')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required /></label>
                <label className="text-sm font-medium">Postal code<input value={formData.postalCode} onChange={update('postalCode')} className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" /></label>
              </div>
            </div>
          </section>

          <fieldset className="bg-white rounded-xl p-6 shadow-sm">
            <legend className="font-semibold mb-4">Shipping method</legend>
            <div className="space-y-3">
              {Object.entries(shippingPrices).map(([method, price]) => (
                <label key={method} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${formData.shippingMethod === method ? 'border-brand-teal bg-brand-teal/5' : 'border-gray-200 hover:border-brand-teal'}`}>
                  <span className="flex items-center gap-3"><input type="radio" name="shipping" value={method} checked={formData.shippingMethod === method} onChange={update('shippingMethod')} /><span><span className="block font-medium capitalize">{method} shipping</span><span className="block text-sm text-gray-500">{method === 'express' ? '1–2' : '3–5'} business days</span></span></span>
                  <span className="font-medium">{formatNaira(price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" disabled={isSubmitting} className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white py-4 rounded-lg font-medium text-lg transition disabled:opacity-50">
            {isSubmitting ? 'Placing order…' : `Place order — ${formatNaira(total)}`}
          </button>
          <p className="text-center text-sm text-gray-500">By placing an order, you will receive confirmation and shipping updates by email.</p>
        </form>

        <aside className="bg-white rounded-xl p-6 shadow-sm h-fit" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="font-semibold mb-4">Order summary</h2>
          <div className="space-y-4 mb-4">
            {items.map((item) => <div key={item.id} className="flex gap-4"><img src={item.images?.[0]} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" /><div className="flex-1"><p className="font-medium text-sm">{item.name}</p><p className="text-sm text-gray-500">Qty: {item.quantity}</p></div><p className="font-medium">{formatNaira(item.price * item.quantity)}</p></div>)}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></p><p className="flex justify-between"><span>Shipping</span><span>{formatNaira(shippingCost)}</span></p><p className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>{formatNaira(total)}</span></p></div>
          <Link to="/cart" className="block mt-5 text-center text-sm font-medium text-brand-teal hover:underline">Edit cart</Link>
        </aside>
      </div>
    </div>
  );
}
