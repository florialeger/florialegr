import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);
  const setLoading = useCallback((v) => setIsLoading(!!v), []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return ctx;
};

export default LoadingProvider;
