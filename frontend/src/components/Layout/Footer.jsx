export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        <div>
          <h2 className="font-bold text-slate-900 mb-2">Teslim Digital Shop</h2>
          <p>Quality electronics, delivered across Nigeria.</p>
        </div>
        <nav aria-label="Footer navigation">
          <h3 className="font-semibold text-slate-900 mb-2">Shop</h3>
          <ul className="space-y-1">
            <li><a href="/shop" className="hover:text-brand-teal">All products</a></li>
          </ul>
        </nav>
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Contact</h3>
          <p>orders@teslimdigital.com</p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 pb-6">
        © {new Date().getFullYear()} Teslim Digital Shop. All rights reserved.
      </p>
    </footer>
  );
}
