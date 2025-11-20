import React, { forwardRef, memo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowIcon, DownloadIcon } from '@/components/ui/icons';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './Button.module.css';

const ICON_MAP = {
  arrow: ArrowIcon,
  download: DownloadIcon,
};

const resolveIcon = (icon, size, iconProps = {}) => {
  const combinedClassName = `${styles.icon} ${iconProps.className || ''}`.trim();
  if (React.isValidElement(icon)) {
    const existingClassName = icon.props?.className || '';
    return React.cloneElement(icon, {
      ...iconProps,
      className: `${existingClassName} ${combinedClassName}`.trim(),
      size: icon.props?.size ?? size,
    });
  }

  const IconComponent = ICON_MAP[icon] || ArrowIcon;
  return <IconComponent size={size} className={combinedClassName} {...iconProps} />;
};

const isExternalUrl = (value) => /^https?:\/\//i.test(value);

const ButtonBase = (
  {
    label,
    icon = '',
    iconSize = 20,
    className = '',
    onClick,
    to,
    href,
    download,
    target,
    rel,
    type = 'button',
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
  const setMagneticNode = useMagneticEffect(magneticOptions);
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

  const iconElement = icon ? resolveIcon(icon, iconSize, iconProps) : null;

  const content = (
    <span className={styles.inner}>
      <h3 className={styles.label}>{label}</h3>
      {iconElement ? <span className={styles.iconWrapper}>{iconElement}</span> : null}
    </span>
  );

  const sharedProps = {
    className: `${styles.button} ${className}`.trim(),
    onClick: handleClick,
    'aria-disabled': disabled || undefined,
    ref: mergedRef,
    ...props,
  };

  if (isRouterLink) {
    return (
      <Link {...sharedProps} to={to} tabIndex={disabled ? -1 : undefined}>
        {content}
      </Link>
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
    <button {...sharedProps} type={type} disabled={disabled} data-disabled={disabled || undefined}>
      {content}
    </button>
  );
};

const Button = memo(forwardRef(ButtonBase));

Button.displayName = 'Button';

Button.propTypes = {
  label: PropTypes.string.isRequired,
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
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  magnetic: PropTypes.bool,
  magneticOptions: PropTypes.object,
};

export default Button;
