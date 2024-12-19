import { useState } from 'react';

export function useErrorHandling() {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    clearError
  };
}