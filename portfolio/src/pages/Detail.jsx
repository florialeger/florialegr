import { useEffect, useMemo, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Reveal } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Link from '@/components/ui/Link';
import CardGrid from '@/components/projects/CardGrid';
import Container from '@/components/ui/Container';
import LoadAnimation from '@/components/loaders/LoadAnimation';
import { usePortfolio } from '@/contexts/PortfolioContext';
import formatDate from '@/utils/formatDate';
import formatDuration from '@/utils/formatDuration';
import { resolveMediaPath } from '@/utils/media';
import styles from './Detail.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import Media from '@/components/ui/Media';
import { ExternalLinkIcon, GoBackIcon, ArrowPreviousIcon, ArrowNextIcon } from '@/components/ui/icons';

// Subtle slide animations (20-30px with blur)
const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
`;

const Detail = ({ variant }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loading,
    getProjectBySlug,
    getPlaygroundBySlug,
    getWorkBySlug,
    projects,
    playgrounds,
    work,
    imagesPreloaded,
  } = usePortfolio();
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const titleRef = useRef(null);

  // Get filter from location state or default to 'all'
  const currentFilter = location.state?.filter || 'all';

  // Track animation direction for slide transitions
  const [animationKey, setAnimationKey] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState(slideInFromLeft);

  const data = useMemo(() => {
    if (variant === 'work') {
      // Check if it's a work experience first
      const workItem = getWorkBySlug(slug);
      if (workItem) return { ...workItem, isWorkExperience: true };
      // Otherwise return project
      return getProjectBySlug(slug);
    }
    return getPlaygroundBySlug(slug);
  }, [getPlaygroundBySlug, getProjectBySlug, getWorkBySlug, slug, variant]);

  // Get filtered list based on variant and filter
  const filteredItems = useMemo(() => {
    if (variant === 'work') {
      // Determine if current item is a work experience
      const isCurrentWorkExp = data?.isWorkExperience;

      if (isCurrentWorkExp) {
        // Return only work experiences
        return [...work].sort((a, b) => {
          const aOngoing = !a.endDate;
          const bOngoing = !b.endDate;
          if (aOngoing && !bOngoing) return -1;
          if (!aOngoing && bOngoing) return 1;
          return new Date(b.startDate || 0) - new Date(a.startDate || 0);
        });
      } else {
        // Return only projects (filter out work experience slugs)
        const workSlugs = new Set(work.map((w) => w.slug));
        return [...projects]
          .filter((p) => !workSlugs.has(p.slug))
          .sort((a, b) => {
            const aOngoing = a.duration === 'ongoing';
            const bOngoing = b.duration === 'ongoing';
            if (aOngoing && !bOngoing) return -1;
            if (!aOngoing && bOngoing) return 1;
            return new Date(b.created || 0) - new Date(a.created || 0);
          });
      }
    }
    // For playground, apply filter
    if (currentFilter === 'all') {
      return playgrounds;
    }
    return playgrounds.filter((item) => item.type === currentFilter);
  }, [currentFilter, playgrounds, projects, work, variant, data]);

  // Find current index and calculate prev/next
  const currentIndex = useMemo(() => {
    return filteredItems.findIndex((item) => item.slug === slug);
  }, [filteredItems, slug]);

  const prevItem = currentIndex > 0 ? filteredItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < filteredItems.length - 1 ? filteredItems[currentIndex + 1] : null;

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
    const setMag = useMagneticEffect({ maxDistance: 10, scale: 1.02 });
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

    navigate(returnTo, {
      replace: true,
      state: { scrollTo: location.state?.scrollTo },
    });
  };

  const handlePrevious = () => {
    if (!prevItem) return;
    setCurrentAnimation(slideInFromLeft);
    setAnimationKey((prev) => prev + 1);
    const path = variant === 'work' ? `/work/${prevItem.slug}` : `/playground/${prevItem.slug}`;
    navigate(path, {
      state: {
        from: location.state?.from,
        filter: currentFilter,
        scrollTo: { slug: prevItem.slug },
      },
      replace: true,
    });
  };

  const handleNext = () => {
    if (!nextItem) return;
    setCurrentAnimation(slideInFromRight);
    setAnimationKey((prev) => prev + 1);
    const path = variant === 'work' ? `/work/${nextItem.slug}` : `/playground/${nextItem.slug}`;
    navigate(path, {
      state: {
        from: location.state?.from,
        filter: currentFilter,
        scrollTo: { slug: nextItem.slug },
      },
      replace: true,
    });
  };

  // Magnetic effect for navigation buttons
  const setBackMag = useMagneticEffect({ maxDistance: 4, scale: 1.02 });
  const setPrevMag = useMagneticEffect({ maxDistance: 4, scale: 1.02 });
  const setNextMag = useMagneticEffect({ maxDistance: 4, scale: 1.02 });

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
  const isWorkExperience = Boolean(data.isWorkExperience);

  // Format dates for work experiences
  const formatWorkDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

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
      <Reveal keyframes={currentAnimation} triggerOnce={false} duration={800} key={`${slug}-${animationKey}`}>
        <article className={`${pageLayout.container} ${styles.card}`.trim()}>
          <header className={styles.header} data-condensed={isHeaderCondensed}>
            <div className={styles.headerColumn}>
              {isWorkExperience ? (
                <>
                  <h3 ref={titleRef}>{data.company}</h3>
                  {data.role && <p className={styles.badgeList}>{data.role}</p>}
                </>
              ) : (
                <>
                  <h3 ref={titleRef}>{data.title}</h3>
                  {duties.length > 0 && <p className={styles.badgeList}>{duties.join(', ')}</p>}
                </>
              )}
            </div>

            <div className={styles.metaColumn}>
              <dl className={styles.metaList}>
                {isWorkExperience ? (
                  <>
                    <div className={styles.metaItem}>
                      <dd>
                        {formatWorkDate(data.startDate)} - {formatWorkDate(data.endDate)}
                      </dd>
                    </div>
                    {data.endDate && (
                      <div className={styles.metaItem}>
                        <dt>duration</dt>
                        <dd>
                          {(() => {
                            const start = new Date(data.startDate);
                            const end = new Date(data.endDate);
                            const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));
                            return months === 1 ? '1 month' : `${months} months`;
                          })()}
                        </dd>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </dl>
            </div>
          </header>

          {isWorkExperience && data.description && <p className={styles.shortDescription}>{data.description}</p>}

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
                      <Link
                        key={link.url}
                        label={link.label}
                        icon={<ExternalLinkIcon />}
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
              {!imagesPreloaded && <LoadAnimation />}
              <CardGrid
                ref={imageGridRef}
                className={styles.imageGrid}
                style={{ opacity: imagesPreloaded ? 1 : 0, transition: 'opacity 400ms ease' }}
              >
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

          {(prevItem || nextItem) && (
            <nav className={styles.navigationSection}>
              {prevItem && (
                <button ref={setPrevMag} onClick={handlePrevious} className={styles.navItem}>
                  <ArrowPreviousIcon className={styles.navArrow} />
                  <p className={styles.navTitle}>{prevItem.company || prevItem.title}</p>
                </button>
              )}
              {nextItem && (
                <button ref={setNextMag} onClick={handleNext} className={`${styles.navItem} ${styles.navItemRight}`}>
                  <p className={styles.navTitle}>{nextItem.company || nextItem.title}</p>
                  <ArrowNextIcon className={styles.navArrow} />
                </button>
              )}
            </nav>
          )}
        </article>
      </Reveal>
      <Button
        ref={setBackMag}
        label="Go Back"
        icon={<GoBackIcon />}
        onClick={handleClose}
        className={styles.goBackButton}
      />
    </div>
  );
};

Detail.propTypes = {
  variant: PropTypes.oneOf(['work', 'playground']).isRequired,
};

export default Detail;
