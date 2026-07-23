export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <section className="max-w-7xl mx-auto px-4 pt-10" aria-labelledby="teslim-digital-heading">
        <div className="rounded-2xl bg-slate-900 px-6 py-8 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-lg">
          <div>
            <h2 id="teslim-digital-heading" className="text-xl font-bold text-white">Discover the Teslim Digital world</h2>
            <p className="text-slate-300 mt-1">Explore the stories, campaigns, and music behind the shop.</p>
          </div>
          <a
            href="https://teslim.digital"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-teal px-6 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand-teal-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Visit Teslim Digital
          </a>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        <div>
          <h2 className="font-bold text-slate-900 mb-2">Teslim Digital Shop</h2>
          <p>Merchandise, books, campaigns, and thoughtful gadgets.</p>
        </div>
        <nav aria-label="Footer navigation">
          <h3 className="font-semibold text-slate-900 mb-2">Shop</h3>
          <ul className="space-y-1">
            <li><a href="/shop" className="hover:text-brand-teal">All products</a></li>
            <li><a href="/order-lookup" className="hover:text-brand-teal">Find a guest order</a></li>
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
