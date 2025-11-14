import PropTypes from 'prop-types';
import styles from './IconBase.module.css';

// Placeholder path for the back arrow; replace with the precise path from the design file.
const BACK_ARROW_PATH =
  'M0.000976562 13.0349C0.0159033 12.5679 0.191493 12.1036 0.535156 11.7351L10.8916 0.6355C11.6449 -0.17165 12.9102 -0.215884 13.7178 0.536867C14.5254 1.29036 14.5698 2.55735 13.8164 3.36499L6.13379 11.5984L23.998 11.5984C25.1025 11.5984 25.9978 12.494 25.998 13.5984C25.998 14.703 25.1026 15.5984 23.998 15.5984L7.03809 15.5984L13.8164 22.863C14.5696 23.6707 14.5253 24.9368 13.7178 25.6902C12.9101 26.4432 11.645 26.399 10.8916 25.5916L0.535156 14.4919C0.191958 14.1239 0.016233 13.6605 0.000976562 13.1941C-0.000283495 13.1674 0.000197474 13.1407 0 13.114C0.000188215 13.0876 -0.00024855 13.0613 0.000976562 13.0349Z';

const BackArrow = ({ className = '', size = 28, title }) => {
  const combinedClassName = `${styles.icon} ${styles.primary} ${className}`.trim();
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  return (
    <svg
      className={combinedClassName}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={BACK_ARROW_PATH}
        fill="#171717"
        stroke="#171717"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

BackArrow.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};

export default BackArrow;
