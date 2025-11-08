// src/App.js

import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ClientBody from '@/components/layout/ClientBody';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import SiteEntryAnimation from '@/components/loaders/SiteEntryAnimation';
import ErrorBoundary from '@/components/utility/ErrorBoundary';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const location = useLocation();

  const handleEntryAnimationFinish = () => {
    setIsInitialLoading(false);
    setTimeout(() => setIsInitialLoading(false), 200);
  };

  const isDetailRoute = useMemo(() => /^\/(?:work|playground)\//.test(location.pathname), [location.pathname]);

  const hideThemeSwitcher = isDetailRoute;

  // Render only the entry animation initially
  if (isInitialLoading) {
    return <SiteEntryAnimation onFinished={handleEntryAnimationFinish} />;
  }

  // Render the main app structure after the entry animation finishes
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <ClientBody>
          <div className="App">
            {' '}
            {/* Optional: Add fade-in class here */}
            <Header />
            <main>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
            {!isDetailRoute && <Footer />}
            {!hideThemeSwitcher && <ThemeSwitcher />}
          </div>
        </ClientBody>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;
