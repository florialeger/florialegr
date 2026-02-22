import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const ExternalLinkIcon = ({ className = '', size = 20, title }) => {
  const combinedClassName = `${styles.icon} ${styles.primary} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <svg
      className={combinedClassName}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5353 1.3179C18.7112 1.50544 18.8226 1.7548 18.8322 2.03191L19.0007 6.86703C19.0217 7.47418 18.5458 7.98399 17.9386 8.00503C17.3318 8.02591 16.8233 7.5512 16.802 6.94437L16.7212 4.62487L11.8412 9.50487C11.4117 9.93402 10.7156 9.93405 10.2862 9.50487C9.85669 9.07541 9.85691 8.37939 10.2862 7.94979L15.1668 3.0691L12.846 2.9883C12.2391 2.96702 11.765 2.45796 11.786 1.85099C11.8071 1.24392 12.3162 0.7686 12.9233 0.789643L17.7591 0.957443C18.0357 0.967163 18.2844 1.07886 18.4717 1.25437C18.4758 1.25809 18.4801 1.26164 18.4842 1.26542L18.5249 1.30616C18.5285 1.30998 18.5318 1.31404 18.5353 1.3179Z"
        fill="currentColor"
      />
      <path
        d="M17 12V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5C3 3.89543 3.89543 3 5 3H8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

ExternalLinkIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default ExternalLinkIcon;
