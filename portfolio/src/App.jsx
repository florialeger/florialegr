// Example in src/App.js

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ClientBody from '@/components/layout/ClientBody';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';
import SiteEntryAnimation from '@/components/loaders/SiteEntryAnimation'; // Import the new component
import ErrorBoundary from '@/components/utility/ErrorBoundary'; // Good practice

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleEntryAnimationFinish = () => {
    setIsInitialLoading(false);
     setTimeout(() => setIsInitialLoading(false), 200);
  };

  // Render only the entry animation initially
  if (isInitialLoading) {
    return <SiteEntryAnimation onFinished={handleEntryAnimationFinish} />;
  }

  // Render the main app structure after the entry animation finishes
  return (
    <ThemeProvider>
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
          <Footer />
          <ThemeSwitcher />
        </div>
      </ClientBody>
    </ThemeProvider>
  );
}

export default App;
