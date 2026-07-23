import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEOMeta from '../components/SEO/SEOMeta';

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isEmail = identifier.includes('@');
    const credentials = isEmail
      ? { email: identifier, password }
      : { phone: identifier, password };

    const result = await login(credentials);
    if (result.success) {
      navigate(location.state?.from || '/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <SEOMeta title="Log In" description="Log in to your Teslim Digital Shop account." url="" />
      <h1 className="text-2xl font-bold mb-8 text-center">Log in</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}

        <div>
          <label htmlFor="identifier" className="block text-sm font-medium mb-1">Email or phone</label>
          <input
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-11 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
        >
          {isLoading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-brand-teal font-medium hover:underline">Register</Link>
        </p>
        <p className="text-sm text-center"><Link to="/forgot-password" className="text-brand-teal font-medium hover:underline">Forgot your password?</Link></p>
      </form>
    </div>
  );
}
