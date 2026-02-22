import { useEffect } from 'react';
import PropTypes from 'prop-types';

import ShinyText from '../ui/ShinyText';
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
      <h3 className={styles.wordmark}>
        <ShinyText
          text="Loading..."
          speed={2}
          delay={0}
          color="var(--label---tertiary)"
          shineColor="var(--label---primary)"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
        />
      </h3>
    </div>
  );
};

LoadAnimation.propTypes = {
  onFinished: PropTypes.func,
  duration: PropTypes.number,
};

export default LoadAnimation;
