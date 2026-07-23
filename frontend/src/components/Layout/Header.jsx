import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition focus:ring-2 focus:ring-brand-teal/40 outline-none ${
    isActive ? 'text-brand-teal' : 'text-slate-700 hover:text-brand-teal'
  }`;

export default function Header() {
  const toggleCart = useUiStore((s) => s.toggleCart);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button
          onClick={toggleMobileNav}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-brand-teal/40 outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="font-bold text-xl text-brand-teal-dark focus:ring-2 focus:ring-brand-teal/40 outline-none rounded">
          Teslim Digital
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/order-lookup" className={navLinkClass}>Order lookup</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-brand-teal/40 outline-none"
            aria-label={isAuthenticated ? 'View profile' : 'Log in'}
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={toggleCart}
            className="relative w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-brand-teal/40 outline-none"
            aria-label={`Open cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
