import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

/**
 * Base component for SVG file-based icons
 * Provides consistent handling of size, className, and accessibility
 */
const SvgIcon = ({ src, className = '', size = 16, title, alt = '' }) => {
  const combinedClassName = `${styles.icon} ${styles.primary} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <img src={src} alt={alt || title || ''} className={combinedClassName} width={size} height={size} {...ariaProps} />
  );
};

SvgIcon.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
  alt: PropTypes.string,
};

export default SvgIcon;
