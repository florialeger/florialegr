import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './Container.module.css';

/**
 * A layout component to wrap content, providing consistent max-width and padding.
 */
const Container = ({
  children,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const combinedClassName = `${styles.container} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType, // Allows rendering as 'section', 'article', etc.
};

// Memoize for performance if children aren't expected to change rapidly without prop changes
export default memo(Container);
