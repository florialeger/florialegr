import React, { memo } from 'react';
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
    <span className={combinedClassName} style={style} {...props}>
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

/* --- Icon.module.css (Example) ---
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle; /* Adjust as needed */
  fill: currentColor; /* Allows color inheritance or override via prop/style 
}

.icon svg {
  display: block;
  width: 100%;
  height: 100%;
}


/* --- Example src/assets/svgs/icons.js ---
export { ReactComponent as GithubIcon } from './github.svg'; // Using SVGR
export { ReactComponent as LinkedinIcon } from './linkedin.svg';
export { ReactComponent as EmailIcon } from './email.svg';
// ... import and export all icons you need
*/