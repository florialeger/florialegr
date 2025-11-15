import { memo, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { resolveMediaPath } from '@/utils/media';
import { ArrowIcon, LockIcon } from '@/components/ui/icons';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './ProjectCard.module.css';
import Media from '@/components/ui/Media';

const WorkCard = memo(({ item, className, onHoverChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search]
  );

  const categoryLabel = useMemo(() => {
    if (item.projectDuty?.length) {
      return item.projectDuty[0];
    }
    if (item.type) {
      return item.type
        .toString()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return 'Project';
  }, [item.projectDuty, item.type]);

  const handlePointerEnter = useCallback(() => {
    onHoverChange?.(item.slug);
  }, [item.slug, onHoverChange]);

  const handlePointerLeave = useCallback(() => {
    onHoverChange?.(null);
  }, [onHoverChange]);

  const handleClick = useCallback(() => {
    if (item.isLocked) return;
    navigate(`/work/${item.slug}`, {
      state: { from: fromPath },
    });
  }, [fromPath, item.isLocked, item.slug, navigate]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const setMagneticNode = useMagneticEffect();
  const shouldMagnetize = !item.isLocked;

  useEffect(() => {
    if (!shouldMagnetize) {
      setMagneticNode(null);
    }

    return () => {
      setMagneticNode(null);
    };
  }, [setMagneticNode, shouldMagnetize]);

  return (
    <article
      className={`${styles.card} ${styles.work} ${className}`.trim()}
      tabIndex={0}
      role={item.isLocked ? 'group' : 'button'}
      aria-disabled={item.isLocked}
      data-locked={item.isLocked}
      data-slug={item.slug}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => onHoverChange?.(item.slug)}
      onBlur={() => onHoverChange?.(null)}
      ref={shouldMagnetize ? setMagneticNode : undefined}
    >
      <div className={styles.inner} data-reveal-target>
        <p className={styles.category + ' text-body-italic'}>{categoryLabel}</p>
        <div className={styles.titleRow}>
          <h4>{item.title}</h4>
          <span className={styles.statusIcon} aria-hidden="true">
            {item.isLocked ? (
              <LockIcon size={22} />
            ) : item.icon ? (
              <img src={item.icon} alt="" className={styles.iconImage} />
            ) : (
              <ArrowIcon size={22} />
            )}
          </span>
        </div>
      </div>
    </article>
  );
});
WorkCard.displayName = 'WorkCard';

const PlaygroundCard = memo(({ item, className, onHoverChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const primaryImage = useMemo(() => resolveMediaPath(item.primaryImage?.[0]), [item.primaryImage]);
  const fromPath = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search]
  );

  const handleClick = useCallback(() => {
    navigate(`/playground/${item.slug}`, {
      state: { from: fromPath },
    });
  }, [fromPath, item.slug, navigate]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const setMagneticNode = useMagneticEffect();

  useEffect(
    () => () => {
      setMagneticNode(null);
    },
    [setMagneticNode]
  );

  return (
    <div className={styles.playgroundWrapper} ref={setMagneticNode}>
      <h2 className={styles.ghostTitle} aria-hidden="true">
        {item.title}
      </h2>

      <article
        className={`${styles.card} ${styles.playground} ${className}`.trim()}
        tabIndex={0}
        role="button"
        data-slug={item.slug}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={() => onHoverChange?.(item.slug)}
        onPointerLeave={() => onHoverChange?.(null)}
        onFocus={() => onHoverChange?.(item.slug)}
        onBlur={() => onHoverChange?.(null)}
      >
        {primaryImage && (
          <div className={styles.preview}>
            <Media src={primaryImage} alt={`${item.title} preview`} className="" />
          </div>
        )}
      </article>
    </div>
  );
});
PlaygroundCard.displayName = 'PlaygroundCard';

const ProjectCard = ({ item, variant = 'work', onHoverChange, className }) => {
  if (variant === 'playground') {
    return <PlaygroundCard item={item} className={className} onHoverChange={onHoverChange} />;
  }
  return <WorkCard item={item} className={className} onHoverChange={onHoverChange} />;
};

ProjectCard.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    projectDuty: PropTypes.arrayOf(PropTypes.string),
    support: PropTypes.arrayOf(PropTypes.string),
    primaryImage: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string,
    isLocked: PropTypes.bool,
  }).isRequired,
  variant: PropTypes.oneOf(['work', 'playground']),
  onHoverChange: PropTypes.func,
  className: PropTypes.string,
};

ProjectCard.defaultProps = {
  variant: 'work',
  onHoverChange: undefined,
  className: '',
};

export default memo(ProjectCard);
export { WorkCard, PlaygroundCard };
