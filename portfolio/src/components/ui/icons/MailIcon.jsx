import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const MailIcon = ({ className = '', size = 20, title }) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2816 3.26171C18.1965 3.01105 18.6544 2.88612 18.888 3.13671C19.1211 3.38736 18.9646 3.83499 18.6507 4.72948L14.6224 16.209C14.3599 16.957 14.2285 17.3324 13.9281 17.4043C13.6274 17.4758 13.3409 17.2005 12.7689 16.6514L10.0882 14.0781L9.27571 14.8174C8.46238 15.5568 8.05534 15.9265 7.71809 15.7773C7.38083 15.6281 7.38118 15.0779 7.38118 13.9785V12.0859L12.6243 8.10741C13.8245 7.19675 14.4251 6.74175 14.3216 6.56737C14.2173 6.39319 13.5325 6.70702 12.1624 7.33495L5.26301 10.4961L2.72981 9.3203C1.55549 8.77508 0.96859 8.50167 1.0013 8.10741C1.03457 7.71317 1.65898 7.54226 2.90755 7.20018L17.2816 3.26171Z"
        fill="currentColor"
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
