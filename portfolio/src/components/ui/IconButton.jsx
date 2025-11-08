import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import styles from './IconButton.module.css';

const renderIcon = (icon, size) => {
  if (!icon) {
    return null;
  }

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      size: icon.props?.size ?? size,
      className: `${styles.icon} ${icon.props?.className || ''}`.trim(),
      'aria-hidden': true,
    });
  }

  if (typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent size={size} className={styles.icon} aria-hidden />;
  }

  return null;
};

const IconButtonBase = (
  { icon, label, className = '', size = '2.75rem', type = 'button', disabled = false, ...props },
  ref
) => {
  const style = { '--icon-button-size': typeof size === 'number' ? `${size}px` : size };

  return (
    <button
      ref={ref}
      type={type}
      className={`${styles.iconButton} ${className}`.trim()}
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      style={style}
      {...props}
    >
      <span className={styles.iconWrapper}>{renderIcon(icon, size)}</span>
    </button>
  );
};

const IconButton = memo(forwardRef(IconButtonBase));

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
};

export default IconButton;
