import { memo } from 'react';
import PropTypes from 'prop-types';
import { resolveIconPath } from '@/utils/icons';
import styles from './Icon.module.css';

/**
 * Renders an icon image based on the provided name.
 */
const Icon = ({ name, size = '1em', className = '', alt = '', ...props }) => {
  // Construct the icon filename
  const iconFilename = name ? `${name}-icone.png` : null;
  const iconSrc = iconFilename ? resolveIconPath(iconFilename) : null;

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }

  const combinedClassName = `${styles.icon} ${className}`.trim();

  const style = {
    width: size,
    height: size,
    flexShrink: 0,
  };

  return <img src={iconSrc} alt={alt} className={combinedClassName} style={style} {...props} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  alt: PropTypes.string,
};

export default memo(Icon);

/* Example usage of Icon component and styles documented in project wiki. */
