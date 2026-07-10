export default function ReviewSection({ productId }) {
  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Customer Reviews
        </h2>
        <p className="mt-2 text-gray-600">
          Read what customers have to say about this product.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          Reviews for product <strong>#{productId}</strong> will appear here
          once the review feature is connected to the backend.
        </p>
      </div>
    </section>
  );
}