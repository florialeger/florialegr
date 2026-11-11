import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMediaDimensions, resolveMediaPath } from '@/utils/media';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import styles from './ProjectCard.module.css';
import Media from '@/components/ui/Media';

const WorkCard = memo(({ item, className, onHoverChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);
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

    // Store card position for scroll restoration
    let cardPosition = null;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardPosition = {
        top: rect.top + window.scrollY,
        slug: item.slug,
      };
    }

    navigate(`/projects/${item.slug}`, {
      state: { from: fromPath, filter: 'all', scrollTo: cardPosition },
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

  const handleRef = useCallback(
    (node) => {
      cardRef.current = node;
      if (shouldMagnetize) {
        setMagneticNode(node);
      }
    },
    [setMagneticNode, shouldMagnetize]
  );

  return (
    <article
      className={`${styles.card} ${styles.work} ${className}`.trim()}
      tabIndex={0}
      role={item.isLocked ? 'group' : 'button'}
      aria-disabled={item.isLocked}
      data-locked={item.isLocked}
      data-slug={item.slug}
      data-created={item.created}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => onHoverChange?.(item.slug)}
      onBlur={() => onHoverChange?.(null)}
      ref={handleRef}
    >
      <div className={styles.inner} data-reveal-target>
        <p className={styles.category}>{categoryLabel}</p>
        <div className={styles.titleRow}>
          <h4>{item.title}</h4>
          <span className={styles.statusIcon} aria-hidden="true">
            <img src={item.icon} alt="" className={styles.iconImage} />
          </span>
        </div>
      </div>
    </article>
  );
});
WorkCard.displayName = 'WorkCard';

const PlaygroundCard = memo(({ item, className, onHoverChange, currentFilter, layout, layoutStyle, loading, fetchPriority, onMediaLoad }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);
  const primaryImage = useMemo(() => resolveMediaPath(item.primaryImage?.[0]), [item.primaryImage]);
  const mediaDimensions = useMemo(() => getMediaDimensions(item.primaryImage?.[0]), [item.primaryImage]);
  const mediaRatio = mediaDimensions?.width && mediaDimensions?.height
    ? mediaDimensions.width / mediaDimensions.height
    : 1;
  const fromPath = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search]
  );

  const handleClick = useCallback(() => {
    // Store card position for scroll restoration
    let cardPosition = null;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardPosition = {
        top: rect.top + window.scrollY,
        slug: item.slug,
      };
    }

    navigate(`/playground/${item.slug}`, {
      state: { from: fromPath, filter: currentFilter || 'all', scrollTo: cardPosition },
    });
  }, [currentFilter, fromPath, item.slug, navigate]);

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

  const handleRef = useCallback(
    (node) => {
      cardRef.current = node;
      setMagneticNode(node);
    },
    [setMagneticNode]
  );

  return (
    <div
      className={`${styles.playgroundWrapper} ${layout === 'justified' ? styles.justifiedWrapper : ''}`.trim()}
      ref={handleRef}
      style={{ '--media-ratio': mediaRatio, ...layoutStyle }}
    >
      <article
        className={`${styles.card} ${styles.playground} ${className}`.trim()}
        tabIndex={0}
        role="button"
        data-slug={item.slug}
        data-created={item.created}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={() => onHoverChange?.(item.slug)}
        onPointerLeave={() => onHoverChange?.(null)}
        onFocus={() => onHoverChange?.(item.slug)}
        onBlur={() => onHoverChange?.(null)}
      >
        {primaryImage && (
          <div className={styles.preview}>
            <Media
              src={primaryImage}
              alt={`${item.title} preview`}
              className=""
              loading={loading}
              fetchPriority={fetchPriority}
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                if (naturalWidth && naturalHeight) {
                  onMediaLoad?.(item.slug, naturalWidth / naturalHeight);
                }
              }}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 33vw"
            />
          </div>
        )}
      </article>
    </div>
  );
});
PlaygroundCard.displayName = 'PlaygroundCard';

const ProjectCard = ({
  item,
  variant = 'work',
  onHoverChange,
  className,
  layout,
  layoutStyle,
  loading,
  fetchPriority,
  onMediaLoad,
}) => {
  if (variant === 'playground') {
    return (
      <PlaygroundCard
        item={item}
        className={className}
        onHoverChange={onHoverChange}
        layout={layout}
        layoutStyle={layoutStyle}
        loading={loading}
        fetchPriority={fetchPriority}
        onMediaLoad={onMediaLoad}
      />
    );
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
  currentFilter: PropTypes.string,
  layout: PropTypes.oneOf(['justified']),
  layoutStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  loading: PropTypes.oneOf(['eager', 'lazy']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
  onMediaLoad: PropTypes.func,
};

ProjectCard.defaultProps = {
  variant: 'work',
  onHoverChange: undefined,
  className: '',
  layout: undefined,
  layoutStyle: undefined,
  loading: 'lazy',
  fetchPriority: 'auto',
  onMediaLoad: undefined,
};

export default memo(ProjectCard);
export { WorkCard, PlaygroundCard };
