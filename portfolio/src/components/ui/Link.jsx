import React, { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowIcon, DownloadIcon } from '@/components/ui/icons';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './Link.module.css';

const ICON_MAP = {
  arrow: ArrowIcon,
  download: DownloadIcon,
};

const resolveIcon = (icon, size, isHovered, iconProps = {}) => {
  const combinedClassName = `${styles.icon} ${iconProps.className || ''}`.trim();
  const strokeWidth = isHovered ? 2.6 : 2;

  if (React.isValidElement(icon)) {
    const existingClassName = icon.props?.className || '';
    return React.cloneElement(icon, {
      ...iconProps,
      className: `${existingClassName} ${combinedClassName}`.trim(),
      size: icon.props?.size ?? size,
      strokeWidth: icon.props?.strokeWidth ?? strokeWidth,
    });
  }

  const IconComponent = ICON_MAP[icon] || ArrowIcon;
  return <IconComponent size={size} strokeWidth={strokeWidth} className={combinedClassName} {...iconProps} />;
};

const isExternalUrl = (value) => /^https?:\/\//i.test(value);

const LinkBase = (
  {
    label,
    icon = '',
    iconSize = 12,
    className = '',
    onClick,
    to,
    href,
    download,
    target,
    rel,
    disabled = false,
    iconProps = {},
    magnetic = true,
    magneticOptions,
    ...props
  },
  ref
) => {
  const isRouterLink = Boolean(to);
  const isAnchor = Boolean(href);
  const [isHovered, setIsHovered] = useState(false);
  const defaultMagneticOptions = { maxDistance: 4, easing: 0.25, scale: 1.02 };
  const setMagneticNode = useMagneticEffect(magneticOptions || defaultMagneticOptions);
  const shouldMagnetize = magnetic && !disabled;

  useEffect(() => {
    if (!shouldMagnetize) {
      setMagneticNode(null);
    }

    return () => {
      setMagneticNode(null);
    };
  }, [setMagneticNode, shouldMagnetize]);

  const mergedRef = useCallback(
    (node) => {
      if (shouldMagnetize) {
        setMagneticNode(node);
      } else {
        setMagneticNode(null);
      }

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        ref.current = node;
      }
    },
    [ref, setMagneticNode, shouldMagnetize]
  );

  const computedTarget = isAnchor && !download ? target || (isExternalUrl(href) ? '_blank' : undefined) : target;
  const computedRel = rel || (computedTarget === '_blank' ? 'noopener noreferrer' : undefined);

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (onClick) {
      onClick(event);
    }
  };

  const iconElement = icon ? resolveIcon(icon, iconSize, isHovered, iconProps) : null;

  const content = (
    <span className={styles.inner}>
      <h3 className={styles.label}>{typeof label === 'string' ? label : label}</h3>
      {iconElement ? <span className={styles.iconWrapper}>{iconElement}</span> : null}
    </span>
  );

  const sharedProps = {
    className: `${styles.link} ${className}`.trim(),
    onClick: handleClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    'aria-disabled': disabled || undefined,
    ref: mergedRef,
    ...props,
  };

  if (isRouterLink) {
    return (
      <RouterLink {...sharedProps} to={to} tabIndex={disabled ? -1 : undefined}>
        {content}
      </RouterLink>
    );
  }

  if (isAnchor) {
    return (
      <a
        {...sharedProps}
        href={href}
        download={download}
        target={computedTarget}
        rel={computedRel}
        tabIndex={disabled ? -1 : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <span {...sharedProps} role="link" aria-disabled={disabled || undefined}>
      {content}
    </span>
  );
};

const Link = memo(forwardRef(LinkBase));

Link.displayName = 'Link';

Link.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconProps: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
  href: PropTypes.string,
  download: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  target: PropTypes.string,
  rel: PropTypes.string,
  disabled: PropTypes.bool,
  magnetic: PropTypes.bool,
  magneticOptions: PropTypes.object,
};

export default Link;
