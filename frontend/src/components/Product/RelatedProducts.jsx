export default function RelatedProducts({
  categoryId,
  excludeId,
}) {
  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Related Products
        </h2>
        <p className="mt-2 text-gray-600">
          Discover other products you may like.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          Related products from category{" "}
          <strong>{categoryId}</strong> (excluding product{" "}
          <strong>{excludeId}</strong>) will appear here once the product
          recommendation service is implemented.
        </p>
      </div>
    </section>
  );
}