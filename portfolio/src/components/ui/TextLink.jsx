import PropTypes from 'prop-types';
import styles from './TextLink.module.css';

/**
 * TextLink component for inline links within paragraphs
 * Features dotted underline and hover effect
 */
const TextLink = ({ href, children, external = true }) => {
  const linkProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <a href={href} className={styles.textLink} {...linkProps}>
      {children}
    </a>
  );
};

TextLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  external: PropTypes.bool,
};

export default TextLink;
