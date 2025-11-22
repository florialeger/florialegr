import { createElement, memo } from 'react';
import PropTypes from 'prop-types';
import styles from './Container.module.css';

const Container = ({ children, className = '', as, ...props }) => {
  const combinedClassName = `${styles.container} ${className}`.trim();

  return createElement(
    as || 'div',
    {
      className: combinedClassName,
      ...props,
    },
    children
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType, // Allows rendering as 'section', 'article', etc.
};

// Memoize for performance if children aren't expected to change rapidly without prop changes
export default memo(Container);
