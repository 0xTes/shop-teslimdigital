import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '../components/Product/ProductGrid';
import CategoryFilter from '../components/Filters/CategoryFilter';
import SortDropdown from '../components/Filters/SortDropdown';
import Pagination from '../components/UI/Pagination';
import DealBanner from '../components/WeeklyDeal/DealBanner';
import { useProducts } from '../hooks/useProducts';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  const { products, totalPages, isLoading } = useProducts({ 
    page, search, category, sort 
  });

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DealBanner />
      
      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => updateParams({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:border-brand-teal transition md:hidden"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
        
        <SortDropdown value={sort} onChange={(v) => updateParams({ sort: v })} />
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <CategoryFilter 
            selected={category} 
            onChange={(v) => updateParams({ category: v })} 
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination 
                currentPage={page} 
                totalPages={totalPages}
                onPageChange={(p) => updateParams({ page: p.toString() })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
