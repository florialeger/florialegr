import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

// Replace the placeholder path values with precise design data when available.
const DOWNLOAD_PATH =
  'M17.5 11.667C17.9602 11.667 18.333 12.0398 18.333 12.5V15.833C18.333 16.496 18.0704 17.1327 17.6016 17.6016C17.1327 18.0704 16.496 18.333 15.833 18.333H4.16699C3.50395 18.333 2.86728 18.0704 2.39844 17.6016C1.9296 17.1327 1.66699 16.496 1.66699 15.833V12.5C1.66699 12.0398 2.03976 11.667 2.5 11.667C2.96024 11.667 3.33301 12.0398 3.33301 12.5V15.833C3.33301 16.054 3.42087 16.2666 3.57715 16.4229C3.73343 16.5791 3.94598 16.667 4.16699 16.667H15.833C16.054 16.667 16.2666 16.5791 16.4229 16.4229C16.5791 16.2666 16.667 16.054 16.667 15.833V12.5C16.667 12.0398 17.0398 11.667 17.5 11.667ZM10 1.66699C10.4602 1.66703 10.833 2.03978 10.833 2.5V10.4863L13.5771 7.74414C13.9025 7.41885 14.4304 7.41905 14.7559 7.74414C15.0809 8.06949 15.0808 8.59652 14.7559 8.92188L10.5889 13.0889C10.4982 13.1795 10.3917 13.244 10.2783 13.2842C10.2653 13.2888 10.2525 13.2939 10.2393 13.2979C10.229 13.3009 10.2184 13.303 10.208 13.3057C10.1938 13.3093 10.1796 13.3135 10.165 13.3164C10.1512 13.3192 10.137 13.3202 10.123 13.3223C10.0828 13.3282 10.0419 13.333 10 13.333L9.91504 13.3291C9.90183 13.3278 9.88899 13.3242 9.87598 13.3223C9.862 13.3202 9.84786 13.3192 9.83398 13.3164C9.81976 13.3135 9.80594 13.3093 9.79199 13.3057C9.78129 13.3029 9.77037 13.301 9.75977 13.2979C9.74651 13.2939 9.73367 13.2888 9.7207 13.2842C9.60757 13.244 9.50068 13.1794 9.41016 13.0889L5.24414 8.92188C4.91904 8.59641 4.91882 8.06947 5.24414 7.74414C5.56947 7.41885 6.09642 7.41905 6.42188 7.74414L9.16699 10.4883V2.5C9.16699 2.03976 9.53976 1.66699 10 1.66699Z';

const DownloadIcon = ({ className = '', size = 24, title }) => {
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
      <path d={DOWNLOAD_PATH} fill="var(--label---primary)" stroke="var(--label---primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

DownloadIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default DownloadIcon;
