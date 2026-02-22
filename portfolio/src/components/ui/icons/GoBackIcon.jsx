import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const GoBackIcon = ({ className = '', size = 20, title }) => {
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
        d="M2.00098 7.67383C2.00914 7.41682 2.10679 7.16175 2.2959 6.95898L6.47852 2.47559C6.893 2.03177 7.58914 2.00756 8.03321 2.42188C8.47711 2.83627 8.50108 3.53243 8.08692 3.97656L5.62403 6.61523L11.3916 6.61523C14.5356 6.61523 17.085 9.16358 17.085 12.3076C17.0848 15.4515 14.5355 18 11.3916 18H8.42969C7.82244 17.9998 7.33025 17.5076 7.33008 16.9004C7.33008 16.293 7.82233 15.801 8.42969 15.8008H11.3916C13.3205 15.8008 14.8846 14.2365 14.8848 12.3076C14.8848 10.3786 13.3206 8.81445 11.3916 8.81445L5.62403 8.81445L8.08692 11.4531C8.50088 11.8973 8.47713 12.5935 8.03321 13.0078C7.58908 13.4222 6.892 13.3981 6.47754 12.9541L2.2959 8.4707C2.08665 8.24642 1.98902 7.95791 2.00098 7.67383Z"
        fill="currentColor"
      />
    </svg>
  );
};

GoBackIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default GoBackIcon;
