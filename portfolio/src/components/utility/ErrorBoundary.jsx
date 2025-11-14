import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Optional: Add styling
// import styles from './ErrorBoundary.module.css';

/**
 * Catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    // Example: logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div role="alert" /*className={styles.errorBoundary}*/>
          <h2>Something went wrong.</h2>
          <p>We're sorry, an unexpected error occurred. Please try refreshing the page.</p>
          {/* Optional: Show error details during development */}
          {import.meta.env?.DEV && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
              <summary>Error Details</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node, // Optional custom fallback component/element
};

export default ErrorBoundary;

/* --- ErrorBoundary.module.css (Example) ---
.errorBoundary {
   padding: 2rem;
   border: 1px solid var(--error-border-color, red);
   background-color: var(--error-bg-color, #fff5f5);
   color: var(--error-color, red);
  border-radius: var(--radius-md);
   text-align: center;
}
 .errorBoundary h2 { margin-bottom: 1rem; }
 .errorBoundary details { text-align: left; color: #666; font-size: 0.9em; }
 .errorBoundary summary { cursor: pointer; font-weight: bold; }
*/
