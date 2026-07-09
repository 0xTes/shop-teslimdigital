import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEOMeta from '../components/SEO/SEOMeta';

export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email && !form.phone) {
      setError('Please provide either an email or phone number');
      return;
    }

    const result = await register(form);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <SEOMeta title="Create Account" description="Create your Teslim Digital Shop account." url="" />
      <h1 className="text-2xl font-bold mb-8 text-center">Create an account</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First name</label>
            <input
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last name</label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email (optional if phone provided)</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (optional if email provided)</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            type="password"
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-11 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-teal font-medium hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
