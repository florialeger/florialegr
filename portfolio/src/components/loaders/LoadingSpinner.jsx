// src/components/loaders/LoadingSpinner.js
import React, { useState, useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';

// Import bird SVGs as components
import { Bird1, Bird2, Bird3, Bird4 } from '@/assets/svgs/IconAnimation';

import styles from './LoadingSpinner.module.css';

const BIRD_CYCLE_INTERVAL = 300; // ms

/**
 * Displays a cycling bird animation for loading states.
 * Can be displayed fullscreen or as a small inline element.
 */
const LoadingSpinner = ({
  size = 'fullscreen', // 'fullscreen', 'small', 'inline'
  className = '',
  message, // Optional loading message
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize the array of bird components
  const birdSvgs = useMemo(() => [Bird1, Bird2, Bird3, Bird4], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % birdSvgs.length);
    }, BIRD_CYCLE_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [birdSvgs.length]); // Re-run effect only if the number of birds changes

  const CurrentBird = birdSvgs[currentIndex];
  const sizeClassName = styles[size] || styles.inline; // Default to inline if size is invalid
  const combinedClassName =
    `${styles.container} ${sizeClassName} ${className}`.trim();

  return (
    <div className={combinedClassName} role="status" aria-live="polite">
      <div className={styles.spinnerWrapper}>
        {CurrentBird && <CurrentBird />}
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['fullscreen', 'small', 'inline']),
  className: PropTypes.string,
  message: PropTypes.string,
};

export default memo(LoadingSpinner);
