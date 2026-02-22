import React, { forwardRef, memo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ArrowIcon,
  ArrowNextIcon,
  ArrowPreviousIcon,
  DownloadIcon,
  MailIcon,
  CloseIcon,
  ExternalLinkIcon,
  GoBackIcon,
  ListIcon,
  CardIcon,
  MenuIcon,
} from '@/components/ui/icons';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './Button.module.css';

const ICON_MAP = {
  arrow: ArrowNextIcon,
  next: ArrowNextIcon,
  previous: ArrowPreviousIcon,
  download: DownloadIcon,
  email: MailIcon,
  mail: MailIcon,
  send: MailIcon,
  Send: MailIcon,
  externalLink: ExternalLinkIcon,
  external: ExternalLinkIcon,
  back: GoBackIcon,
  list: ListIcon,
  card: CardIcon,
  menu: MenuIcon,
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
    labels, // For multi-label buttons
    icon = '',
    iconPosition = 'right',
    iconSize = 14,
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
    variant = 'primary', // 'primary' | 'secondary' | 'tertiary' | 'inactive'
    size = 'small', // 'small' | 'big'
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

  // Handle multi-label buttons
  const hasMultipleLabels = labels && Array.isArray(labels) && labels.length > 1;

  const content = hasMultipleLabels ? (
    <span className={styles.inner}>
      {iconPosition === 'left' && iconElement && <span className={styles.iconWrapper}>{iconElement}</span>}
      <span className={styles.multiLabels}>
        {labels.map((labelText, index) => (
          <h4 key={index} className={styles.label}>
            {labelText}
          </h4>
        ))}
      </span>
      {iconPosition === 'right' && iconElement && <span className={styles.iconWrapper}>{iconElement}</span>}
    </span>
  ) : (
    <span className={styles.inner}>
      {iconPosition === 'left' && iconElement && <span className={styles.iconWrapper}>{iconElement}</span>}
      {(label || (labels && labels[0])) && <h4 className={styles.label}>{label || (labels && labels[0])}</h4>}
      {iconPosition === 'right' && iconElement && <span className={styles.iconWrapper}>{iconElement}</span>}
    </span>
  );

  const variantClass =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'secondary'
        ? styles.buttonSecondary
        : variant === 'tertiary'
          ? styles.buttonTertiary
          : variant === 'inactive'
            ? styles.buttonInactive
            : '';

  const sizeClass = size === 'small' ? styles.buttonSmall : size === 'big' ? styles.buttonBig : '';
  const iconOnlyClass = !label && !labels ? styles.iconOnly : '';

  const sharedProps = {
    className: `${styles.button} ${variantClass} ${sizeClass} ${iconOnlyClass} ${className}`.trim(),
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
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labels: PropTypes.arrayOf(PropTypes.string), // For multi-label buttons
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
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
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'inactive']),
  size: PropTypes.oneOf(['small', 'big']),
};

export default Button;
