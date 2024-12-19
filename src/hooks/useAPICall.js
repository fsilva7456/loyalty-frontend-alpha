import { useState, useCallback } from 'react';

export function useAPICall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return {
    loading,
    error,
    executeCall,
    clearError
  };
}