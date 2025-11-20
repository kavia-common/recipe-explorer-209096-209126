'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useDebouncedValue
 * Returns a debounced version of a value that only updates after `delay` ms
 * of inactivity. Useful for deferring expensive operations (search, API calls).
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => setDebounced(value), Math.max(0, delay));

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [value, delay]);

  return debounced;
}

export default useDebouncedValue;
