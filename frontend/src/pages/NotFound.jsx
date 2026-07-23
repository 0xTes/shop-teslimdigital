import { Link } from 'react-router-dom';
import SEOMeta from '../components/SEO/SEOMeta';

export default function NotFound() {
  return <div className="max-w-2xl mx-auto px-4 py-24 text-center"><SEOMeta title="Page Not Found" description="The requested page could not be found." noIndex /><p className="text-brand-teal font-semibold">404</p><h1 className="mt-2 text-4xl font-bold">This page is not here.</h1><p className="mt-4 text-gray-600">The link may be outdated, or the page may have moved.</p><Link to="/" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-brand-teal px-6 py-3 font-medium text-white hover:bg-brand-teal-dark">Return home</Link></div>;
}
