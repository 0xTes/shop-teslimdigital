import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    shippingMethod: 'standard'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        shipping: {
          ...formData,
          cost: formData.shippingMethod === 'express' ? 5000 : 2500
        }
      });

      clearCart();
      navigate(`/order-success/${data.orderId}`);
    } catch (error) {
      alert('Checkout failed: ' + error.response?.data?.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none"
                  required
                />
                <input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none"
                  required
                />
              </div>
              <input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none"
                required
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required />
                <input placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" required />
                <input placeholder="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Shipping Method</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border border-brand-teal rounded-lg cursor-pointer bg-brand-teal/5">
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" value="standard" checked={formData.shippingMethod === 'standard'} onChange={(e) => setFormData({...formData, shippingMethod: e.target.value})} />
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-gray-500">3-5 business days</p>
                  </div>
                </div>
                <span className="font-medium">₦2,500</span>
              </label>
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-teal transition">
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" value="express" checked={formData.shippingMethod === 'express'} onChange={(e) => setFormData({...formData, shippingMethod: e.target.value})} />
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-gray-500">1-2 business days</p>
                  </div>
                </div>
                <span className="font-medium">₦5,000</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white py-4 rounded-lg font-medium text-lg transition disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : `Complete Order — ₦${(parseFloat(getTotalPrice()) + (formData.shippingMethod === 'express' ? 5000 : 2500)).toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₦{parseFloat(getTotalPrice()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>₦{(formData.shippingMethod === 'express' ? 5000 : 2500).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₦{(parseFloat(getTotalPrice()) + (formData.shippingMethod === 'express' ? 5000 : 2500)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}