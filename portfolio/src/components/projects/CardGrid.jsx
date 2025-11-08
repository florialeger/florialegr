import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import styles from './CardGrid.module.css';

/**
 * A simple grid layout component, typically used for displaying cards.
 */
const CardGridBase = ({ children, className = '', ...props }, ref) => {
  const combinedClassName = `${styles.cardGrid} ${className}`.trim();

  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

const CardGrid = memo(forwardRef(CardGridBase));
CardGrid.displayName = 'CardGrid';

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default CardGrid;
