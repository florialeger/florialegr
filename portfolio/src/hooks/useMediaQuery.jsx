// Checks if a CSS media query matches. Often more declarative than checking raw window size.

import { useState, useEffect } from 'react';

/**
 * Custom hook to track the state of a CSS media query.
 *
 * @param {string} query - The CSS media query string (e.g., '(min-width: 768px)').
 * @returns {boolean} - True if the media query matches, false otherwise.
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false; // Default value or SSR fallback
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return; // Exit if not supported or SSR
    }

    const mediaQueryList = window.matchMedia(query);

    const listener = (event) => {
      setMatches(event.matches);
    };

    // Add listener - check for newer addEventListener first
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(listener);
    }

    // Initial check in case the state changed between useState init and effect run
    setMatches(mediaQueryList.matches);

    // Cleanup function
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]); // Re-run effect if the query string changes

  return matches;
}

export default useMediaQuery;

/*
// --- How to Use ---
import useMediaQuery from './useMediaQuery';

function MyComponent() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div>
      {isDesktop ? <p>Desktop View</p> : <p>Mobile/Tablet View</p>}
      {prefersDarkMode && <p>User prefers dark mode!</p>}
    </div>
  );
}
*/