import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * A versatile button component that can act as a button, internal link, or external link.
 */
const Button = ({
  children,
  onClick,
  to, // For react-router Link
  href, // For external anchor link
  variant = 'primary', // e.g., 'primary', 'secondary', 'outline'
  size = 'medium', // e.g., 'small', 'medium', 'large'
  disabled = false,
  className = '',
  type = 'button', // 'button', 'submit', 'reset'
  target, // For anchor links (_blank, etc.)
  rel, // For anchor links (noopener noreferrer)
  ...props
}) => {
  const baseClassName = styles.button;
  const variantClassName = styles[variant] || styles.primary;
  const sizeClassName = styles[size] || styles.medium;
  const combinedClassName =
    `${baseClassName} ${variantClassName} ${sizeClassName} ${className}`.trim();

  // Render as React Router Link
  if (to) {
    return (
      <Link
        to={to}
        className={combinedClassName}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Render as external link
  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        target={target || (href.startsWith('http') ? '_blank' : undefined)} // Default _blank for external
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Render as standard button
  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
  href: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  target: PropTypes.string,
  rel: PropTypes.string,
};

export default memo(Button);


