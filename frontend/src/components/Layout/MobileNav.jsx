import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';

export default function MobileNav() {
  const isMobileNavOpen = useUiStore((s) => s.isMobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);
  const { user } = useAuth();

  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={closeMobileNav} />
      <nav className="relative bg-white w-72 h-full shadow-xl p-6 flex flex-col gap-2" aria-label="Mobile navigation">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg text-brand-teal-dark">Menu</span>
          <button
            onClick={closeMobileNav}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-brand-teal/40 outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Link to="/" onClick={closeMobileNav} className="min-h-11 flex items-center px-2 rounded-lg hover:bg-gray-50">Home</Link>
        <Link to="/shop" onClick={closeMobileNav} className="min-h-11 flex items-center px-2 rounded-lg hover:bg-gray-50">Shop</Link>
        <Link to="/order-lookup" onClick={closeMobileNav} className="min-h-11 flex items-center px-2 rounded-lg hover:bg-gray-50">Order lookup</Link>
        <Link to="/profile" onClick={closeMobileNav} className="min-h-11 flex items-center px-2 rounded-lg hover:bg-gray-50">Profile</Link>
        {user?.role === 'admin' && <Link to="/admin" onClick={closeMobileNav} className="min-h-11 flex items-center px-2 rounded-lg hover:bg-gray-50">Admin</Link>}
      </nav>
    </div>
  );
}
