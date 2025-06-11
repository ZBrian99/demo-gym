import { useEffect } from 'react';

export function useDebounce<T>(value: T, callback: (value: T) => void, delay: number = 300) {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, callback, delay]);
} 

export default useDebounce;