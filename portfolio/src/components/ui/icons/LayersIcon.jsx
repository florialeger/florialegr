import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const LayersIcon = ({ className = '', size = 48, title }) => {
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
      <path d="M32 10L10 22l22 12 22-12L32 10z" fill="currentColor" />
      <path d="M32 34L10 46l22 12 22-12L32 34z" fill="currentColor" opacity="0.5" />
      <path d="M32 22l-18.5 10.1L32 42l18.5-9.9L32 22z" fill="currentColor" opacity="0.7" />
    </svg>
  );
};

LayersIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default LayersIcon;
