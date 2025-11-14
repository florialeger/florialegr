import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

// Replace the path data below with the precise SVG path from the design file when available.
const LOCK_PATH =
  'M12 3C12.8492 3 13.5192 2.98911 14.0996 3.14453C15.5661 3.53754 16.7124 4.68393 17.1055 6.15039C17.2609 6.73074 17.25 7.40087 17.25 8.25V8.53125C18.2611 8.64343 18.8117 8.74343 19.2646 9.21387C19.7694 9.73835 19.8151 10.3989 19.9053 11.7197C20.045 13.7674 20.0302 15.5876 19.8613 17.6826C19.7751 18.7529 19.7315 19.2888 19.3193 19.7783C18.9072 20.2677 18.4582 20.3836 17.5605 20.6143C14.2578 21.463 9.74234 21.4629 6.43945 20.6143C5.54159 20.3835 5.09189 20.2678 4.67969 19.7783C4.26754 19.2888 4.22494 18.7528 4.13867 17.6826C3.9698 15.5875 3.95497 13.7674 4.09473 11.7197C4.18489 10.3987 4.23035 9.73838 4.73535 9.21387C5.18842 8.74335 5.7384 8.64348 6.75 8.53125V7.64551C6.75422 7.07164 6.77796 6.58569 6.89453 6.15039C7.28762 4.68394 8.43388 3.53748 9.90039 3.14453C10.4807 2.9892 11.1509 3 12 3ZM12 11.25C10.8956 11.25 10.0002 12.1456 10 13.25C10 13.9897 10.4029 14.6335 11 14.9795V17.25C11 17.8023 11.4477 18.25 12 18.25C12.5521 18.2498 13 17.8021 13 17.25V14.9795C13.5968 14.6335 14 13.9895 14 13.25C13.9998 12.1457 13.1043 11.2502 12 11.25ZM12 5.5C10.9902 5.5 10.7293 5.51076 10.5469 5.55957C9.94323 5.72138 9.47151 6.19329 9.30957 6.79688C9.26068 6.97933 9.25 7.23984 9.25 8.25V8.32227C11.0402 8.22674 12.9599 8.22669 14.75 8.32227V8.25C14.75 7.23984 14.7393 6.97933 14.6904 6.79688C14.5285 6.19328 14.0567 5.72144 13.4531 5.55957C13.2707 5.51068 13.0102 5.5 12 5.5Z';

const LockIcon = ({ className = '', size = 20, title }) => {
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
      <path d={LOCK_PATH} fill="var(--label---secondary)" />
    </svg>
  );
};

LockIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default LockIcon;
