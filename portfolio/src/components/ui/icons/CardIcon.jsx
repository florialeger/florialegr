import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const CardIcon = ({ className = '', size = 20, title }) => {
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
        d="M3 5.4C3 4.07452 4.07452 3 5.4 3H8.4C8.73137 3 9 3.26863 9 3.6V8.4C9 8.73137 8.73137 9 8.4 9H3.6C3.26863 9 3 8.73137 3 8.4V5.4Z"
        fill="currentColor"
      />
      <path
        d="M11.3999 3.60012C11.3999 3.26875 11.6685 3.00012 11.9999 3.00012H14.9999C16.3254 3.00012 17.3999 4.07464 17.3999 5.40012V8.40012C17.3999 8.73149 17.1313 9.00012 16.7999 9.00012H11.9999C11.6685 9.00012 11.3999 8.73149 11.3999 8.40012V3.60012Z"
        fill="currentColor"
      />
      <path
        d="M3 12.0001C3 11.6688 3.26863 11.4001 3.6 11.4001H8.4C8.73137 11.4001 9 11.6688 9 12.0001V16.8001C9 17.1315 8.73137 17.4001 8.4 17.4001H5.4C4.07452 17.4001 3 16.3256 3 15.0001V12.0001Z"
        fill="currentColor"
      />
      <path
        d="M11.3999 12.0001C11.3999 11.6688 11.6685 11.4001 11.9999 11.4001H16.7999C17.1313 11.4001 17.3999 11.6688 17.3999 12.0001V15.0001C17.3999 16.3256 16.3254 17.4001 14.9999 17.4001H11.9999C11.6685 17.4001 11.3999 17.1315 11.3999 16.8001V12.0001Z"
        fill="currentColor"
      />
    </svg>
  );
};

CardIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default CardIcon;
