import { useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './SiteEntryAnimation.module.css';

const DEFAULT_DURATION = 1200;

const SiteEntryAnimation = ({ onFinished, duration = DEFAULT_DURATION }) => {
  useEffect(() => {
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

SiteEntryAnimation.propTypes = {
  onFinished: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default SiteEntryAnimation;
