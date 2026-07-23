import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEOMeta from '../components/SEO/SEOMeta';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError('');
    try { const { data } = await api.post('/auth/forgot-password', { email }); setMessage(data.message); } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to request a reset link.'); }
  };
  return <div className="max-w-md mx-auto px-4 py-16"><SEOMeta title="Reset Password" description="Reset your Teslim Digital Shop password." noIndex /><h1 className="text-2xl font-bold mb-3">Reset your password</h1><p className="text-gray-600 mb-8">Enter your account email and we&apos;ll send a reset link.</p><form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">{message && <p role="status" className="text-sm text-green-700">{message}</p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-teal" /></label><button className="min-h-11 w-full rounded-lg bg-brand-teal px-5 py-3 font-medium text-white hover:bg-brand-teal-dark">Send reset link</button></form><p className="mt-5 text-center text-sm"><Link to="/login" className="text-brand-teal hover:underline">Back to log in</Link></p></div>;
}
