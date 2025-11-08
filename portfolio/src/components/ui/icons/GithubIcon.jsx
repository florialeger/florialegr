import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

const GithubIcon = ({ className = '', size = 48, title }) => {
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
      <path
        d="M32 8C19.193 8 9 18.193 9 31c0 10.162 6.594 18.79 15.742 21.827.03.01.062.014.094.014.58 0 .804-.422.804-.834 0-.41-.015-1.73-.023-3.147-6.403 1.423-7.75-2.84-7.75-2.84-.528-1.38-1.29-2.446-1.29-2.446-1.055-.72.08-.706.08-.706 1.168.082 1.782 1.2 1.782 1.2 1.037 1.775 2.723 1.262 3.39.966.105-.764.406-1.262.739-1.553-5.11-.584-10.478-2.64-10.478-11.75 0-2.594.924-4.715 2.44-6.377-.244-.6-1.06-3.023.233-6.305 0 0 1.994-.638 6.54 2.435 1.894-.53 3.926-.796 5.95-.807 2.02.01 4.053.277 5.95.807 4.542-3.073 6.532-2.435 6.532-2.435 1.298 3.282.482 5.705.238 6.305 1.52 1.662 2.437 3.783 2.437 6.377 0 9.134-5.378 11.158-10.505 11.726.418.37.79 1.103.79 2.226 0 1.607-.014 2.9-.014 3.294 0 .416.216.842.804.842.032 0 .064-.005.094-.014C48.414 49.79 55 41.162 55 31 55 18.193 44.807 8 32 8z"
        fill="currentColor"
      />
    </svg>
  );
};

GithubIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default GithubIcon;
