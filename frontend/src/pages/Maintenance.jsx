import { Helmet } from 'react-helmet-async';
import { Mail, ShoppingBag } from 'lucide-react';

import './Maintenance.css';

export default function Maintenance() {
  return (
    <div className="maintenance-page">
      <Helmet>
        <title>Store maintenance | Teslim Digital Shop</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <a className="maintenance-page__skip-link" href="#maintenance-content">Skip to maintenance notice</a>

      <main id="maintenance-content" className="maintenance-page__main" tabIndex="-1">
        <div className="maintenance-page__ornament maintenance-page__ornament--top" aria-hidden="true" />
        <section className="maintenance-page__card" aria-labelledby="maintenance-title">
          <div className="maintenance-page__brand">
            <span className="maintenance-page__icon" aria-hidden="true">
              <ShoppingBag size={24} strokeWidth={2.25} />
            </span>
            <span>Teslim Digital Shop</span>
          </div>

          <p className="maintenance-page__eyebrow">Store maintenance</p>
          <h1 id="maintenance-title">We’re refreshing the shop.</h1>
          <p className="maintenance-page__message">
            The shop is temporarily unavailable while we make improvements. Thank you for your patience.
          </p>

          <div className="maintenance-page__contact">
            <Mail size={20} aria-hidden="true" />
            <p>
              Need help with an existing order?{' '}
              <a href="mailto:support@teslim.digital">Contact our shop team</a>.
            </p>
          </div>
        </section>
        <div className="maintenance-page__ornament maintenance-page__ornament--bottom" aria-hidden="true" />
      </main>

      <footer className="maintenance-page__footer">
        <a href="mailto:support@teslim.digital">support@teslim.digital</a>
        <span aria-hidden="true">•</span>
        <span>© {new Date().getFullYear()} Teslim Digital Shop</span>
      </footer>
    </div>
  );
}
