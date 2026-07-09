export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="min-w-11 min-h-11 px-3 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 outline-none transition"
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages.map((page, i) => {
        const prevPage = pages[i - 1];
        const showEllipsis = prevPage && page - prevPage > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-400 px-1">…</span>}
            <button
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`min-w-11 min-h-11 px-4 rounded-lg border transition focus:ring-2 focus:ring-brand-teal/30 outline-none ${
                page === currentPage
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'border-gray-200 hover:border-brand-teal'
              }`}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="min-w-11 min-h-11 px-3 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 outline-none transition"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
