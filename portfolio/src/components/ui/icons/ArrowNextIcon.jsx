import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const ArrowNextIcon = ({ className = '', size = 20, title }) => {
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
        d="M18.2232 10.2216C18.2167 10.4812 18.1193 10.7394 17.9283 10.9442L11.3267 18.0204C10.9124 18.4644 10.2162 18.4891 9.77201 18.0751C9.32784 17.6606 9.3029 16.9636 9.71732 16.5194L14.6021 11.285L3.09916 11.285C2.4917 11.285 1.99965 10.7929 1.99955 10.1854C1.99955 9.57792 2.49164 9.08582 3.09916 9.08582L14.6031 9.08582L9.7183 3.85047C9.30389 3.4063 9.3279 2.71023 9.77201 2.29578C10.2162 1.88135 10.9123 1.90531 11.3267 2.34949L17.9283 9.42567C18.1373 9.64971 18.2349 9.93776 18.2232 10.2216Z"
        fill="currentColor"
      />
    </svg>
  );
};

ArrowNextIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default ArrowNextIcon;
