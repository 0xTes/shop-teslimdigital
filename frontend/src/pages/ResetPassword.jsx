import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SEOMeta from '../components/SEO/SEOMeta';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError('');
    try { const { data } = await api.post('/auth/reset-password', { token: params.get('token'), password }); setMessage(data.message); } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to reset password.'); }
  };
  return <div className="max-w-md mx-auto px-4 py-16"><SEOMeta title="Choose a New Password" description="Set a new Teslim Digital Shop password." noIndex /><h1 className="text-2xl font-bold mb-8">Choose a new password</h1><form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">{message && <p role="status" className="text-sm text-green-700">{message} <Link className="underline" to="/login">Log in</Link></p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium">New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="8" required className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-teal" /></label><button className="min-h-11 w-full rounded-lg bg-brand-teal px-5 py-3 font-medium text-white hover:bg-brand-teal-dark">Update password</button></form></div>;
}
