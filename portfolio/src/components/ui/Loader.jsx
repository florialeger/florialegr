import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './Loader.module.css';

/**
 * Displays a loading indicator, often used conditionally based on fetch state.
 */
const Loader = ({
  loading = true,
  size = 'medium',
  className = '',
  message,
}) => {
  if (!loading) {
    return null;
  }

  const sizeClassName = styles[size] || styles.medium;
  const combinedClassName =
    `${styles.loaderContainer} ${sizeClassName} ${className}`.trim();

  return (
    <div className={combinedClassName} role="status" aria-live="polite">
      <div className={styles.spinner}></div>
      {message && <span className={styles.message}>{message}</span>}
    </div>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.string,
};

export default memo(Loader);

/* --- Loader.module.css (Example CSS Spinner) ---
.loaderContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.spinner {
  border: 4px solid var(--loader-bg-color, rgba(0, 0, 0, 0.1));
  border-left-color: var(--loader-color, var(--primary-color, blue));
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.medium .spinner { width: 40px; height: 40px; border-width: 4px;}
.small .spinner { width: 20px; height: 20px; border-width: 2px;}
.large .spinner { width: 60px; height: 60px; border-width: 6px;}


.message {
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: var(--text-secondary-color, grey);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
