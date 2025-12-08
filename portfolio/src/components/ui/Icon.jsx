import { memo } from 'react';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import PropTypes from 'prop-types';
// Import your SVG components - adjust path as needed
import * as AllIcons from '@/assets/svgs/icons'; // Assuming icons.js exports named SVGs
import styles from './Icon.module.css';

/**
 * Renders an SVG icon component based on the provided name.
 */
const Icon = ({
  name,
  size = '1em', // Default to current font size
  color, // Inherits color by default if not set
  className = '',
  title, // For accessibility
  ...props
}) => {
  const setMagnet = useMagneticEffect({ maxDistance: 4, scale: 1.02 });
  const IconComponent = AllIcons[name]; // Find the component by name
  const combinedClassName = `${styles.icon} ${className}`.trim();

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found.`);
    return null; // Or return a placeholder icon
  }

  const style = {
    width: size,
    height: size,
    color: color, // Apply color directly if provided
    flexShrink: 0, // Prevent shrinking in flex containers
  };

  return (
    <span ref={setMagnet} className={combinedClassName} style={style} {...props}>
      <IconComponent aria-hidden={!title} title={title} />
    </span>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired, // Name matching the exported SVG component
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string, // Accessibility title
};

export default memo(Icon);

/* Example usage of Icon component and styles documented in project wiki. */
