import { useMemo, useRef, useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { Reveal } from 'react-awesome-reveal';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import LoadAnimation from '@/components/loaders/LoadAnimation';
import { usePortfolio } from '@/contexts/PortfolioContext';
import formatDate from '@/utils/formatDate';
import formatDuration from '@/utils/formatDuration';
import { resolveMediaPath } from '@/utils/media';
import parseHtmlText from '@/utils/parseHtmlText';
import styles from './Detail.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import Media from '@/components/ui/Media';
import { ArrowPreviousIcon, ArrowNextIcon } from '@/components/ui/icons';

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

// Animation variants for staggered sections and images
const sectionsContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Small wrapper component for magnetic images with animation
const MagneticImageWrapper = ({ src, className, sectionIndex, imageIndex }) => {
  const setMag = useMagneticEffect({ maxDistance: 10, scale: 1.02 });
  return (
    <motion.div
      key={`${sectionIndex}-${imageIndex}`}
      ref={setMag}
      className={styles.imageWrapper}
      variants={imageVariants}
    >
      <Media src={src} alt="" className={className} />
    </motion.div>
  );
};

MagneticImageWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  imageIndex: PropTypes.number.isRequired,
};

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
  const titleRef = useRef(null);
  const footerRef = useRef(null);

  // Get filter from location state or default to 'all'
  const currentFilter = location.state?.filter || 'all';

  // Track animation direction for slide transitions
  const [animationKey, setAnimationKey] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState(slideInFromLeft);

  // Track if navigation should be docked to footer (bottom of content reached)
  const [isNavDocked, setIsNavDocked] = useState(false);

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

  // Get filtered list based on variant and filter - using already sorted arrays from context
  const filteredItems = useMemo(() => {
    if (variant === 'work') {
      // Determine if current item is a work experience
      const isCurrentWorkExp = data?.isWorkExperience;

      if (isCurrentWorkExp) {
        // Return only work experiences (already sorted in context)
        return work;
      } else {
        // Return only projects (filter out work experience slugs, already sorted in context)
        const workSlugs = new Set(work.map((w) => w.slug));
        return projects.filter((p) => !workSlugs.has(p.slug));
      }
    }
    // For playground, apply filter (already sorted in context)
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
  // Support both old `secondaryImages` and new `sections` structure
  const sections = useMemo(() => {
    if (!data) return [];

    // New sections structure
    if (data.sections && Array.isArray(data.sections)) {
      return data.sections.map((section) => {
        // Handle description as either string or array
        let description = null;
        if (Array.isArray(section.description)) {
          description = section.description.filter(Boolean);
        } else if (typeof section.description === 'string') {
          description = section.description;
        }

        return {
          title: section.title || null,
          description,
          images: (section.images || []).map((img) => resolveMediaPath(img)).filter(Boolean),
        };
      });
    }

    // Fallback to old secondaryImages structure
    if (data.secondaryImages && Array.isArray(data.secondaryImages)) {
      const images = data.secondaryImages.map((img) => resolveMediaPath(img)).filter(Boolean);
      return images.length > 0 ? [{ title: null, description: null, images }] : [];
    }

    return [];
  }, [data]);

  const links = data?.link || [];

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

  // Track scroll position to dock navigation when footer is in view (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined' || !footerRef.current) return undefined;

    const handleScroll = () => {
      // Only apply on desktop (above 900px)
      if (window.innerWidth <= 900) {
        setIsNavDocked(false);
        return;
      }

      const footer = footerRef.current;
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Dock when footer top enters viewport (is visible on screen)
      // More generous trigger - when footer is anywhere in viewport
      const shouldDock = footerRect.top < viewportHeight && footerRect.bottom > 0;

      console.log('Footer detection:', {
        footerTop: footerRect.top,
        viewportHeight,
        shouldDock,
        currentDocked: isNavDocked,
      });

      setIsNavDocked(shouldDock);
    };

    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setIsNavDocked(false);
      } else {
        handleScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

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
            <Button
              label={`Return to ${variant === 'work' ? 'work' : 'playground'}`}
              onClick={handleClose}
              variant="secondary"
              size="big"
            />
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

  const formatWorkDateRange = (startDate, endDate) => {
    const start = formatWorkDate(startDate);
    const end = formatWorkDate(endDate);

    // If both dates are the same, show only once
    if (start === end) {
      return start;
    }

    return `${start} - ${end}`;
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
    <div className={`${pageLayout.page}`.trim()} style={{ gap: 'var(--stack-gap-lg)' }}>
      {!imagesPreloaded && <LoadAnimation />}
      <Reveal keyframes={currentAnimation} triggerOnce={false} duration={800} key={`${slug}-${animationKey}`}>
        <article className={`${pageLayout.container} ${styles.card}`.trim()}>
          {/* HEADER SECTION */}
          <header className={styles.header}>
            {/* Metadata */}
            <div className={styles.headerMetadata}>
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
                        <dd>{formatWorkDateRange(data.startDate, data.endDate)}</dd>
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
            </div>

            {/* Global description (if exists from context) */}
            {contextParagraphs.length > 0 && (
              <div className={styles.globalDescription}>
                {contextParagraphs.map((paragraph, index) => (
                  <p key={index}>{parseHtmlText(paragraph, index)}</p>
                ))}
              </div>
            )}

            {/* Links */}
            {links.length > 0 && (
              <div className={styles.headerLinks}>
                {links.map((link) => (
                  <Button
                    key={link.url}
                    label={link.label}
                    icon="external"
                    iconPosition="right"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    variant="tertiary"
                    size="small"
                  />
                ))}
              </div>
            )}
          </header>

          {/* SECTIONS */}
          {sections.length > 0 && (
            <div className={styles.sectionsContainer}>
              <motion.div
                className={styles.sections}
                style={{ opacity: imagesPreloaded ? 1 : 0, transition: 'opacity 400ms ease' }}
                variants={sectionsContainerVariants}
                initial="hidden"
                animate={imagesPreloaded ? 'show' : 'hidden'}
              >
                {sections.map((section, sectionIndex) => {
                  // First section never has subtitle/description
                  const isFirstSection = sectionIndex === 0;
                  const hasSubheader = !isFirstSection && (section.title || section.description);

                  return (
                    <motion.section key={sectionIndex} className={styles.section} variants={sectionVariants}>
                      {hasSubheader && (
                        <div className={styles.sectionSubheader}>
                          {section.title && <h3 className={styles.sectionTitle}>{section.title}</h3>}
                          {section.description && (
                            <div className={styles.sectionDescription}>
                              {Array.isArray(section.description) ? (
                                section.description.map((paragraph, idx) => (
                                  <p key={idx}>{parseHtmlText(paragraph, idx)}</p>
                                ))
                              ) : (
                                <p>{parseHtmlText(section.description)}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {section.images && section.images.length > 0 && (
                        <motion.div
                          className={styles.sectionImages}
                          variants={sectionsContainerVariants}
                          initial="hidden"
                          animate="show"
                        >
                          {section.images.map((image, imageIndex) => (
                            <MagneticImageWrapper
                              key={`${sectionIndex}-${imageIndex}`}
                              src={image}
                              className={styles.imageItem}
                              sectionIndex={sectionIndex}
                              imageIndex={imageIndex}
                            />
                          ))}
                        </motion.div>
                      )}
                    </motion.section>
                  );
                })}
              </motion.div>
            </div>
          )}
        </article>
      </Reveal>

      {/* Footer with navigation */}
      {(prevItem || nextItem) && (
        <footer ref={footerRef} className={styles.detailFooter}>
          <nav className={`${styles.navigationSection} ${isNavDocked ? styles.navigationDocked : ''}`}>
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
        </footer>
      )}

      <Button
        ref={setBackMag}
        label="Go Back"
        icon="back"
        iconPosition="left"
        onClick={handleClose}
        className={styles.goBackButton}
        variant="secondary"
        size="big"
      />
    </div>
  );
};

Detail.propTypes = {
  variant: PropTypes.oneOf(['work', 'playground']).isRequired,
};

export default Detail;
