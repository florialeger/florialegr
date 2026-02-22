import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const ArrowPreviousIcon = ({ className = '', size = 20, title }) => {
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
        d="M2.00095 9.77811C2.0074 9.51849 2.10484 9.26024 2.29587 9.05545L8.89743 1.97928C9.31187 1.5351 10.0089 1.51114 10.4531 1.92557C10.8968 2.34005 10.921 3.03623 10.5068 3.48026L5.62204 8.71463L17.1259 8.71463C17.7331 8.71489 18.2254 9.20702 18.2256 9.81424C18.2256 10.4216 17.7332 10.9136 17.1259 10.9138L5.62106 10.9138L10.5058 16.1492C10.9203 16.5934 10.8963 17.2904 10.4521 17.7049C10.0079 18.1189 9.31175 18.0942 8.89743 17.6502L2.29587 10.574C2.08681 10.3499 1.9892 10.0619 2.00095 9.77811Z"
        fill="currentColor"
      />
    </svg>
  );
};

ArrowPreviousIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default ArrowPreviousIcon;
