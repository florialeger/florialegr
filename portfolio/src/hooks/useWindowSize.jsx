// Gets the current dimensions of the viewport.

import { useState, useEffect } from 'react';

// Optional: Debounce function to limit resize handler calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Custom hook to track window dimensions.
 * @param {number} debounceDelay - Optional delay (ms) to debounce resize events. Default 0 (no debounce).
 * @returns {{ width: number, height: number }} - Object containing window width and height.
 */
function useWindowSize(debounceDelay = 0) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Exit if window is not available (SSR)
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const effectiveHandler =
      debounceDelay > 0 ? debounce(handleResize, debounceDelay) : handleResize;

    window.addEventListener('resize', effectiveHandler);

    // Call handler once initially to set size correctly
    handleResize();

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', effectiveHandler);
  }, [debounceDelay]); // Re-run effect only if debounceDelay changes

  return windowSize;
}

export default useWindowSize;

/*
// --- How to Use ---
import useWindowSize from './useWindowSize';

function ResponsiveComponent() {
  const { width } = useWindowSize(200); // Debounce resize by 200ms

  return (
    <div>
      Current window width: {width}px
      {width < 768 ? <p>Showing mobile layout</p> : <p>Showing desktop layout</p>}
    </div>
  );
}
*/
