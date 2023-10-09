import { useRef, useCallback } from 'react';

type DebounceFunction<T> = (...args: T[]) => void;

export function useDebounce<T>(fn: DebounceFunction<T>, delay: number): DebounceFunction<T> {
  const timeoutRef = useRef<number | null>(null);

  const debouncedFn = useCallback(
    (...args: T[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay],
  );

  return debouncedFn;
}
