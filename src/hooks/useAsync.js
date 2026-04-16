import { useState, useEffect, useCallback } from 'react';

/**
 * Generic async data-fetching hook.
 * Usage: const { data, loading, error, refetch } = useAsync(fetchCourses);
 */
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data, error } = await asyncFn();
      if (error) setState({ data: null, loading: false, error: error.message || String(error) });
      else setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { ...state, refetch: execute };
}

/**
 * Debounce hook for search inputs.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * Persist state to localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const set = useCallback((v) => {
    try {
      const valueToStore = v instanceof Function ? v(value) : v;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) { console.warn('useLocalStorage set failed:', err); }
  }, [key, value]);

  return [value, set];
}
