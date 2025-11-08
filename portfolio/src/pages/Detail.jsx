import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { usePortfolio } from '@/contexts/PortfolioContext';
import formatDate from '@/utils/formatDate';
import { resolveSupportIcons } from '@/utils/supportIcons';
import { resolveMediaPath } from '@/utils/media';
import { CloseIcon } from '@/components/ui/icons';
import styles from './Detail.module.css';

const Detail = ({ variant }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, getProjectBySlug, getPlaygroundBySlug } = usePortfolio();
  const scrollRef = useRef(null);
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);

  const data = useMemo(() => {
    return variant === 'work' ? getProjectBySlug(slug) : getPlaygroundBySlug(slug);
  }, [getPlaygroundBySlug, getProjectBySlug, slug, variant]);

  const supports = useMemo(() => resolveSupportIcons(data?.support || []), [data]);
  const duties = useMemo(() => data?.projectDuty?.filter(Boolean) ?? [], [data]);
  const contextParagraphs = useMemo(() => {
    if (!data?.context) return [];
    if (Array.isArray(data.context)) return data.context.filter(Boolean);
    if (typeof data.context === 'string') return [data.context];
    return [];
  }, [data]);
  const primaryImage = useMemo(() => resolveMediaPath(data?.primaryImage?.[0]), [data]);
  const secondaryImages = useMemo(() => {
    if (!data?.secondaryImages) return [];
    return data.secondaryImages.map((image) => resolveMediaPath(image)).filter(Boolean);
  }, [data]);
  const links = data?.link || [];

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return undefined;

    const handleScroll = () => {
      setIsHeaderCondensed(node.scrollTop > 32);
    };

    handleScroll();
    node.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      node.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    const fallbackPath = variant === 'work' ? '/work' : '/playground';
    const returnTo =
      typeof location.state?.from === 'string' && location.state.from ? location.state.from : fallbackPath;

    navigate(returnTo, { replace: true });
  };

  if (!loading && !data) {
    return (
      <div className={styles.detailPage}>
        <article className={styles.card} data-empty>
          <IconButton icon={CloseIcon} label="Fermer la fiche" className={styles.closeButton} onClick={handleClose} />
          <div className={styles.emptyState}>
            <h1>Nothing to see here yet.</h1>
            <p>The requested {variant === 'work' ? 'project' : 'playground'} could not be found.</p>
            <Button label={`Return to ${variant === 'work' ? 'work' : 'playground'}`} onClick={handleClose} />
          </div>
        </article>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const createdLabel = data.created ? formatDate(data.created) : 'Unknown';
  const durationLabel = data.duration ? `${data.duration} ${Number(data.duration) > 1 ? 'months' : 'month'}` : null;
  return (
    <div className={styles.detailPage}>
      <article className={styles.card}>
        <IconButton
          icon={CloseIcon}
          label="Fermer la fenêtre de détail"
          className={styles.closeButton}
          onClick={handleClose}
        />
        <div ref={scrollRef} className={styles.scrollArea}>
          <header className={styles.header} data-condensed={isHeaderCondensed}>
            <div className={styles.headerInner}>
              <div className={styles.headerPrimary}>
                <div className={styles.titleBlock}>
                  <h3>{data.title}</h3>
                </div>
                {duties.length > 0 && (
                  <ul className={styles.badgeList}>
                    {duties.map((duty) => (
                      <li key={duty}>{duty}</li>
                    ))}
                  </ul>
                )}
                {supports.length > 0 && (
                  <ul className={styles.supportList}>
                    {supports.map(({ src, label }) => (
                      <li key={label}>
                        <img src={src} alt={label} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.metaColumn}>
                <dl className={styles.metaList}>
                  <div className={styles.metaItem}>
                    <dt>Created</dt>
                    <dd>{createdLabel}</dd>
                  </div>
                  {durationLabel && (
                    <div className={styles.metaItem}>
                      <dt>Duration</dt>
                      <dd>{durationLabel}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </header>

          {primaryImage && (
            <div className={styles.heroMedia}>
              <img src={primaryImage} alt="" loading="lazy" />
            </div>
          )}

          <section className={styles.overview}>
            <div className={styles.overviewInner}>
              <div className={styles.context}>
                {contextParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              {links.length > 0 && (
                <div className={styles.links}>
                  {links.map((link) => (
                    <Button key={link.url} label={link.label} href={link.url} target="_blank" rel="noreferrer" />
                  ))}
                </div>
              )}
            </div>
          </section>

          {secondaryImages.length > 0 && (
            <section className={styles.gallery}>
              <ul className={styles.imageGrid}>
                {secondaryImages.map((image, index) => (
                  <li
                    key={`${image}-${index}`}
                    className={`${styles.imageItem} ${index % 3 === 2 ? styles.imageWide : ''}`.trim()}
                  >
                    <img src={image} alt="" loading="lazy" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </div>
  );
};

Detail.propTypes = {
  variant: PropTypes.oneOf(['work', 'playground']).isRequired,
};

export default Detail;
