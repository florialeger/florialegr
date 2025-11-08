import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const ArtstationIcon = ({ className = '', size = 48, title }) => {
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
      <path d="M11 48h42L36 16h-8.75L11 48z" fill="currentColor" />
      <path d="M43.5 40.5h8.75L42.2 23.4 35 36.1l8.5 4.4z" fill="currentColor" opacity="0.5" />
      <path d="M18.5 48h19.25l-4.6-8.5H22.6l-4.1 8.5z" fill="currentColor" opacity="0.7" />
    </svg>
  );
};

ArtstationIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default ArtstationIcon;
