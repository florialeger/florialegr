import { useEffect, useMemo, useRef, useState } from 'react';
import RevealAnimation from '@/components/utility/RevealAnimation';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import CardGrid from '@/components/projects/CardGrid';
import Container from '@/components/ui/Container';
import { usePortfolio } from '@/contexts/PortfolioContext';
import formatDate from '@/utils/formatDate';
import formatDuration from '@/utils/formatDuration';
import { resolveMediaPath } from '@/utils/media';
import styles from './Detail.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import Media from '@/components/ui/Media';
import ArrowIcon from '@/components/ui/icons/ArrowIcon';

const Detail = ({ variant }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, getProjectBySlug, getPlaygroundBySlug } = usePortfolio();
  // We no longer use an internal scroll container; track window scroll instead.
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const titleRef = useRef(null);

  const data = useMemo(() => {
    return variant === 'work' ? getProjectBySlug(slug) : getPlaygroundBySlug(slug);
  }, [getPlaygroundBySlug, getProjectBySlug, slug, variant]);

  const duties = useMemo(() => data?.projectDuty?.filter(Boolean) ?? [], [data]);
  const contextParagraphs = useMemo(() => {
    if (!data?.context) return [];
    if (Array.isArray(data.context)) return data.context.filter(Boolean);
    if (typeof data.context === 'string') return [data.context];
    return [];
  }, [data]);
  const secondaryImages = useMemo(() => {
    if (!data?.secondaryImages) return [];
    return data.secondaryImages.map((image) => resolveMediaPath(image)).filter(Boolean);
  }, [data]);
  // We purposely do NOT display the primary image on the Detail page.
  // All visual media should be provided as secondary images and rendered in the gallery below the header.
  const heroImage = null;
  const galleryImages = useMemo(() => secondaryImages, [secondaryImages]);
  const links = data?.link || [];
  const imageGridRef = useRef(null);
  const hasOverview = (contextParagraphs && contextParagraphs.length > 0) || (links && links.length > 0);

  useEffect(() => {
    const handleScroll = () => setIsHeaderCondensed(window.scrollY > 32);
    // Run once to initialize
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Small wrapper component that magnetizes media elements
  const MagneticImage = ({ src, alt, className, children, ...props }) => {
    const setMag = useMagneticEffect({ maxDistance: 18, scale: 1.025 });
    return (
      <div ref={setMag} className={className} {...props}>
        {children || <img src={src} alt={alt} loading="lazy" />}
      </div>
    );
  };

  // Detect when the last row of the grid contains a single item (e.g. odd count in two-column grid)
  // and mark that item so it preserves its intrinsic aspect ratio instead of being forced square.
  useEffect(() => {
    const grid = imageGridRef.current;
    if (!grid) return undefined;

    const applySingleMarking = () => {
      const items = Array.from(grid.children || []).filter((n) => n.nodeType === 1);
      if (items.length === 0) return;

      // Determine number of columns from computed grid-template-columns
      const computed = window.getComputedStyle(grid).gridTemplateColumns || '';
      const columns = computed ? computed.split(/\s+/).filter(Boolean).length : window.innerWidth < 900 ? 1 : 2;

      // Clear previous markings
      items.forEach((it) => it.classList.remove(styles.imageItemSingle));

      if (columns > 1) {
        const remainder = items.length % columns;
        if (remainder === 1) {
          // last item is alone in its row
          const last = items[items.length - 1];
          if (last) last.classList.add(styles.imageItemSingle);
        }
      }
    };

    // Initial run
    applySingleMarking();

    // Re-run on resize (debounced via rAF pattern)
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        applySingleMarking();
      });
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [galleryImages]);

  const handleClose = () => {
    const fallbackPath = variant === 'work' ? '/work' : '/playground';
    const returnTo =
      typeof location.state?.from === 'string' && location.state.from ? location.state.from : fallbackPath;

    navigate(returnTo, { replace: true });
  };

  // Magnetic effect for the bottom "Back" control
  const setBackMag = useMagneticEffect({ maxDistance: 18, scale: 1.03 });

  // legacy reveal hooks removed; we now use viewport reveal + magnetic interactions

  if (!loading && !data) {
    return (
      <div className={`${pageLayout.page} ${styles.detailPage}`.trim()}>
        <article className={`${pageLayout.container} ${styles.card}`.trim()} data-empty>
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

  // For works we normally show the precise launch date (month + day + year when available).
  // For playgrounds we normally show month + year only. However, when a project is ongoing
  // we want the label to read "created" and show the full created date (start date).
  const isOngoing = Boolean(data.isOngoing);
  const createdLabel = data.created
    ? isOngoing
      ? formatDate(data.created)
      : variant === 'work'
        ? formatDate(data.created)
        : formatDate(data.created, 'en-US', { monthYearOnly: true })
    : 'Unknown';

  const durationLabel = data.duration ? formatDuration(data.duration) : null;
  return (
    <div className={`${pageLayout.page}`.trim()}>
      <div className={styles.bottomBar} role="toolbar" aria-label="Navigation">
        <Button ref={setBackMag} label="Go Back" onClick={handleClose} className={styles.backTextButton} />
      </div>
      <RevealAnimation cascade damping={0.2} triggerOnce>
        <article className={`${pageLayout.container} ${styles.card}`.trim()}>
          <header className={styles.header} data-condensed={isHeaderCondensed}>
            <div className={styles.headerColumn}>
              <h3 ref={titleRef}>{data.title}</h3>
              {duties.length > 0 && (
                <ul className={styles.badgeList}>
                  {duties.map((duty) => (
                    <li key={duty}>{duty}</li>
                  ))}
                </ul>
              )}{' '}
            </div>

            <div className={styles.metaColumn}>
              <dl className={styles.metaList}>
                {isOngoing ? (
                  <div className={styles.metaItem}>
                    <dt>started</dt>
                    <dd>{createdLabel}</dd>
                  </div>
                ) : variant === 'work' ? (
                  <div className={styles.metaItem}>
                    <dt>launch</dt>
                    <dd>{createdLabel}</dd>
                  </div>
                ) : (
                  <div className={styles.metaItem}>
                    <dd>{createdLabel}</dd>
                  </div>
                )}

                {/* For ongoing projects we display "ongoing" as the duration value without the label. */}
                {isOngoing ? (
                  <div className={styles.metaItem}>
                    <dd>ongoing</dd>
                  </div>
                ) : (
                  durationLabel && (
                    <div className={styles.metaItem}>
                      <dt>duration</dt>
                      <dd>{durationLabel}</dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          </header>

          {heroImage && <MagneticImage className={styles.heroMedia} src={heroImage} alt="" />}

          {hasOverview && (
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
                      <Button
                        key={link.url}
                        label={link.label}
                        icon={<ArrowIcon />}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {galleryImages.length > 0 && (
            <Container className={styles.gridContainer}>
              <CardGrid ref={imageGridRef} className={styles.imageGrid}>
                {(() => {
                  const isSingleInGrid = galleryImages.length === 1;
                  return galleryImages.map((image, index) => {
                    const wideClass = isSingleInGrid || index % 3 === 2 ? styles.imageWide : '';
                    return (
                      <div key={`${image}-${index}`} className={`${wideClass}`.trim()}>
                        <div className={styles.imageItem}>
                          <Media src={image} alt="" className={styles.imageItem} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </CardGrid>
            </Container>
          )}

          {data.support && data.support.length > 0 && (
            <div className={styles.supportRow}>
              <p className={styles.supportLabel}>support</p>
              {data.support.map((s) => (
                <p key={s} className={`${styles.supportLabel} ${styles.supportValue}`}>
                  {s}
                </p>
              ))}
            </div>
          )}
        </article>
      </RevealAnimation>
    </div>
  );
};

Detail.propTypes = {
  variant: PropTypes.oneOf(['work', 'playground']).isRequired,
};

export default Detail;
