// src/App.js

import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ClientBody from '@/components/layout/ClientBody';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PortfolioProvider } from './contexts/PortfolioContext';
import LoadAnimation from '@/components/loaders/LoadAnimation';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import ErrorBoundary from '@/components/utility/ErrorBoundary';
function AppContent() {
  const location = useLocation();
  const { isLoading } = useLoading();

  const isDetailRoute = useMemo(() => /^\/(?:work|playground)\//.test(location.pathname), [location.pathname]);

  if (isLoading) {
    return <LoadAnimation />;
  }

  return (
    <PortfolioProvider>
      <ClientBody>
        <div className="App">
          <Header />
          <main>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
          {!isDetailRoute && <Footer />}
        </div>
      </ClientBody>
    </PortfolioProvider>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}
