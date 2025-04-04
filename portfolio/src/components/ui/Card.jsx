import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Card.module.css';

/**
 * A basic card component for containing content. Can be made clickable/linkable.
 */
const Card = ({
  children,
  className = '',
  onClick,
  to,
  href,
  as: Component = 'article', // Semantic default
  target,
  rel,
  ...props
}) => {
  const isInteractive = !!(onClick || to || href);
  const combinedClassName = `
    ${styles.card}
    ${isInteractive ? styles.interactive : ''}
    ${className}
  `.trim();

  const commonProps = {
    className: combinedClassName,
    ...props,
  };

  const content = <div className={styles.content}>{children}</div>;

  if (to) {
    return (
      <Link to={to} {...commonProps} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        {...commonProps}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <Component onClick={onClick} role="button" tabIndex={0} {...commonProps}>
        {content}
      </Component>
    );
  }

  return <Component {...commonProps}>{content}</Component>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
  href: PropTypes.string,
  as: PropTypes.elementType,
  target: PropTypes.string,
  rel: PropTypes.string,
};

export default memo(Card);

/* --- Card.module.css (Example) ---
.card {
  background-color: var(--card-bg, white);
  border: 1px solid var(--card-border-color, #e0e0e0);
  border-radius: var(--border-radius-large, 8px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card.interactive {
  cursor: pointer;
}

.card.interactive:hover {
   box-shadow: var(--shadow-md, 0 4px 8px rgba(0,0,0,0.15));
   transform: translateY(-2px);
}

.content {
  padding: var(--card-padding, 1.5rem);
}
*/
