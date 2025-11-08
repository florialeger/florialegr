import { createElement, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './Card.module.css';

/**
 * A basic card component for containing content. Can be made clickable/linkable.
 */
const Card = ({
  children,
  className = '',
  onClick,
  to,
  href,
  as,
  target,
  rel,
  magnetic = true,
  magneticOptions,
  ...props
}) => {
  const elementType = as || 'article';
  const isInteractive = !!(onClick || to || href);
  const setMagneticNode = useMagneticEffect(magneticOptions);
  const shouldUseRef = magnetic && isInteractive && (to || href || typeof elementType === 'string');
  const combinedClassName = `
    ${styles.card}
    ${isInteractive ? styles.interactive : ''}
    ${className}
  `.trim();

  useEffect(() => {
    if (!shouldUseRef) {
      setMagneticNode(null);
    }

    return () => {
      setMagneticNode(null);
    };
  }, [setMagneticNode, shouldUseRef]);

  const commonProps = {
    className: combinedClassName,
    ref: shouldUseRef ? setMagneticNode : undefined,
    ...props,
  };

  const content = <div className={styles.content}>{children}</div>;

  if (to) {
    return (
      <Link to={to} {...commonProps} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        {...commonProps}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return createElement(
      elementType,
      {
        onClick,
        role: 'button',
        tabIndex: 0,
        ...commonProps,
      },
      content
    );
  }

  return createElement(elementType, commonProps, content);
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
  href: PropTypes.string,
  as: PropTypes.elementType,
  target: PropTypes.string,
  rel: PropTypes.string,
  magnetic: PropTypes.bool,
  magneticOptions: PropTypes.object,
};

export default memo(Card);
