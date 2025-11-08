import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

// Replace the placeholder path values with precise design data when available.
const DOWNLOAD_ARROW_PATH = 'M12 4V15.5M12 15.5L7.75 11.25M12 15.5L16.25 11.25';
const DOWNLOAD_BASE_PATH = 'M6 19.25H18';

const DownloadIcon = ({ className = '', size = 20, title }) => {
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
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={DOWNLOAD_ARROW_PATH}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={DOWNLOAD_BASE_PATH} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};

DownloadIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default DownloadIcon;
