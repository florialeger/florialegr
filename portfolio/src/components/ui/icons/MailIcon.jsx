import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

// Replace the path data below with the precise SVG path from the design file when available.
const MAIL_ENVELOPE_PATH =
  'M22.6642 4.58579C22.0784 4 21.1356 4 19.25 4H5.25C3.36438 4 2.42157 4 1.83579 4.58579M22.6642 4.58579C23.25 5.17157 23.25 6.11438 23.25 8V16C23.25 17.8856 23.25 18.8284 22.6642 19.4142C22.0784 20 21.1356 20 19.25 20H5.25C3.36438 20 2.42157 20 1.83579 19.4142C1.25 18.8284 1.25 17.8856 1.25 16V8C1.25 6.11438 1.25 5.17157 1.83579 4.58579M22.6642 4.58579L19.5323 7.32962L15.0873 11.4011C14.3262 12.0983 13.9457 12.4468 13.5409 12.6398C12.7243 13.029 11.7757 13.029 10.9592 12.6398C10.5543 12.4468 10.1738 12.0983 9.41274 11.4011L4.96775 7.32962L1.83579 4.58579';
const MailIcon = ({ className = '', size = 20, title }) => {
  const combinedClassName = `${styles.icon} ${styles.primary} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <svg
      className={combinedClassName}
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...ariaProps}
    >
        {title ? <title>{title}</title> : null}
        <path
          d={MAIL_ENVELOPE_PATH}
          fill="var(--fills---non--opaque)"
          stroke="var(--label---primary)"
          strokeWidth="2.5"
        />

    </svg>
  );
};

MailIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default MailIcon;
