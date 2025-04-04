import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './CardGrid.module.css';

/**
 * A simple grid layout component, typically used for displaying cards.
 */
const CardGrid = ({ children, className = '' }) => {
  const combinedClassName = `${styles.cardGrid} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default memo(CardGrid);

/* --- CardGrid.module.css (Example) ---
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--grid-gap, 1.5rem);
}

@media (max-width: 768px) {
  .cardGrid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: 1rem;
  }
}
 @media (max-width: 480px) {
  .cardGrid {
    grid-template-columns: 1fr; 
  }
}
*/
