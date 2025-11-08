import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const LinkedinIcon = ({ className = '', size = 48, title }) => {
  const combinedClassName = `${styles.icon} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <svg
      className={combinedClassName}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <rect x="8" y="8" width="48" height="48" rx="12" fill="currentColor" />
      <path
        d="M20.5 27.5h5.5V44h-5.5V27.5zm2.75-2.9c1.8 0 2.95-1.2 2.95-2.7-.03-1.54-1.15-2.7-2.9-2.7-1.8 0-2.95 1.16-2.95 2.7 0 1.5 1.15 2.7 2.85 2.7h.05zm8.05 2.9h5.25v2.3h.07c.73-1.3 2.52-2.68 5.18-2.68 3.44 0 6.03 2.25 6.03 7.1V44h-5.5v-8.3c0-1.98-.72-3.33-2.5-3.33-1.36 0-2.17.92-2.53 1.81-.13.32-.17.76-.17 1.2V44h-5.53V27.5z"
        fill="#fff"
      />
    </svg>
  );
};

LinkedinIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default LinkedinIcon;
