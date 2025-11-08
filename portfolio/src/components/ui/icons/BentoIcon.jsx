import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const BentoIcon = ({ className = '', size = 48, title }) => {
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
      <rect x="8" y="8" width="22" height="22" rx="6" fill="currentColor" />
      <rect x="34" y="8" width="22" height="22" rx="6" fill="currentColor" opacity="0.7" />
      <rect x="8" y="34" width="22" height="22" rx="6" fill="currentColor" opacity="0.85" />
      <rect x="34" y="34" width="22" height="22" rx="6" fill="currentColor" opacity="0.5" />
    </svg>
  );
};

BentoIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default BentoIcon;
