import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const MENU_PATH = 'M3 6h18M3 12h18M3 18h18';

const MenuIcon = ({ className = '', size = 16, strokeWidth = 2, title }) => {
  const combinedClassName = `${styles.icon} ${styles.primary} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <svg
      className={combinedClassName}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={MENU_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

MenuIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
};

export default MenuIcon;
