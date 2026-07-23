import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductGrid from '../components/Product/ProductGrid';
import DealBanner from '../components/WeeklyDeal/DealBanner';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import SEOMeta from '../components/SEO/SEOMeta';

export default function Home() {
  const { products, isLoading, isError } = useFeaturedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SEOMeta
        title="Home"
        description="Shop Teslim Digital merchandise, books, campaigns, and practical gadgets."
        url={typeof window !== 'undefined' ? window.location.href : undefined}
      />

      <section className="text-center py-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Meaningful goods, delivered to your door
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Merchandise, books, campaigns, and practical gadgets — thoughtfully selected for you.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 min-h-11 bg-brand-teal hover:bg-brand-teal-dark text-white px-8 py-3 rounded-lg font-medium transition focus:ring-2 focus:ring-brand-teal/40 outline-none"
        >
          Shop now <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <DealBanner />

      <section aria-labelledby="featured-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="featured-heading" className="text-2xl font-bold">Featured Products</h2>
          <Link to="/shop" className="text-brand-teal font-medium hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : isError ? (
          <p role="alert" className="text-center py-12 text-gray-600">Featured products are temporarily unavailable.</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}
