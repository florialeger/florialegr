import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const ListIcon = ({ className = '', size = 20, title }) => {
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
      <path d="M10.6001 6.40002H17.8001" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10.6001 13.6H17.8001" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="3.4" cy="6.4" r="2.4" fill="currentColor" />
      <circle cx="3.4" cy="13.6" r="2.4" fill="currentColor" />
    </svg>
  );
};

ListIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default ListIcon;
