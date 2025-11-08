import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

// Replace the placeholder path below with the precise SVG data from the design file when available.
const CLOSE_ICON_PATH = 'M6 6L18 18M18 6L6 18';

const CloseIcon = ({ className = '', size = 20, title }) => {
  const combinedClassName = `${styles.icon} ${styles.primary} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <svg
      className={combinedClassName}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <path d={CLOSE_ICON_PATH} />
    </svg>
  );
};

CloseIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default CloseIcon;
