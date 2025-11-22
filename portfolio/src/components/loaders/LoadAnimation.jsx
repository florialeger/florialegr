import { useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './LoadAnimation.module.css';

const DEFAULT_DURATION = null;

// Loading indicator used by the App while waiting for content to load.
// It will auto-finish only when a positive `duration` (ms) is provided.
const LoadAnimation = ({ onFinished, duration = DEFAULT_DURATION }) => {
  useEffect(() => {
    if (typeof duration !== 'number' || duration <= 0) return undefined;

    const timeout = setTimeout(() => {
      if (typeof onFinished === 'function') {
        onFinished();
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onFinished]);

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span className={styles.wordmark}>Loading...</span>
    </div>
  );
};

LoadAnimation.propTypes = {
  onFinished: PropTypes.func,
  duration: PropTypes.number,
};

export default LoadAnimation;
