import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No products found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <section
      aria-label="Products"
      className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
