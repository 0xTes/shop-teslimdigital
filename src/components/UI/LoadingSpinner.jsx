export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sizeClasses[size]} rounded-full border-brand-teal-light border-t-brand-teal animate-spin`}
    />
  );
}
