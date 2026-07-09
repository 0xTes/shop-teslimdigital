import { useEffect, useState } from 'react';

// Debounces a fast-changing value (e.g. a search input) so callers don't
// fire a network request on every keystroke.
export function useDebouncedValue(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
