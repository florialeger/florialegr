import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import formatDate from '@/utils/formatDate';
import formatDuration from '@/utils/formatDuration';
import formatDateDifference from '@/utils/formatDateDifference';
import { resolveMediaPath } from '@/utils/media';
import parseHtmlText from '@/utils/parseHtmlText';
import styles from './Detail.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import Media from '@/components/ui/Media';
import { ArrowPreviousIcon, ArrowNextIcon } from '@/components/ui/icons';

const Detail = ({ variant }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loading,
    getProjectBySlug,
    getPlaygroundBySlug,
    getWorkBySlug,
    projectsInDataOrder,
    playgrounds,
    workInDataOrder,
  } = usePortfolio();
  const titleRef = useRef(null);
  const footerRef = useRef(null);

  // Get filter from location state or default to 'all'
  const currentFilter = location.state?.filter || 'all';

  // Track if navigation should be docked to footer (bottom of content reached)
  const [isNavDocked, setIsNavDocked] = useState(false);
  const previousCaptionState = useRef({ lastY: 0 });
  const nextCaptionState = useRef({ lastY: 0 });
  const previousCaptionX = useMotionValue(0);
  const previousCaptionY = useMotionValue(0);
  const previousCaptionScale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });
  const previousCaptionOpacity = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const previousCaptionRotate = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const nextCaptionX = useMotionValue(0);
  const nextCaptionY = useMotionValue(0);
  const nextCaptionScale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });
  const nextCaptionOpacity = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const nextCaptionRotate = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

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

  // Keep main projects before secondary projects, matching their order in data.json.
  const filteredItems = useMemo(() => {
    if (variant === 'work') {
      return [...workInDataOrder, ...projectsInDataOrder];
    }
    // For playground, apply filter (already sorted in context)
    if (currentFilter === 'all') {
      return playgrounds;
    }
    return playgrounds.filter((item) => item.type === currentFilter);
  }, [currentFilter, playgrounds, projectsInDataOrder, workInDataOrder, variant]);

  // Find current index and calculate prev/next
  const currentIndex = useMemo(() => {
    return filteredItems.findIndex((item) => item.slug === slug);
  }, [filteredItems, slug]);

  const prevItem =
    currentIndex >= 0 && filteredItems.length > 1
      ? filteredItems[(currentIndex - 1 + filteredItems.length) % filteredItems.length]
      : null;
  const nextItem =
    currentIndex >= 0 && filteredItems.length > 1
      ? filteredItems[(currentIndex + 1) % filteredItems.length]
      : null;

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

  const handleClose = useCallback(() => {
    const fallbackPath = variant === 'work' ? '/' : '/playground';
    const returnTo =
      typeof location.state?.from === 'string' && location.state.from ? location.state.from : fallbackPath;

    navigate(returnTo, {
      replace: true,
      state: { scrollTo: location.state?.scrollTo },
    });
  }, [location.state?.from, location.state?.scrollTo, navigate, variant]);

  const handlePrevious = useCallback(() => {
    if (!prevItem) return;
    const path = variant === 'work' ? `/projects/${prevItem.slug}` : `/playground/${prevItem.slug}`;
    navigate(path, {
      state: {
        from: location.state?.from,
        filter: currentFilter,
        scrollTo: { slug: prevItem.slug },
      },
      replace: true,
    });
  }, [currentFilter, location.state?.from, navigate, prevItem, variant]);

  const handleNext = useCallback(() => {
    if (!nextItem) return;
    const path = variant === 'work' ? `/projects/${nextItem.slug}` : `/playground/${nextItem.slug}`;
    navigate(path, {
      state: {
        from: location.state?.from,
        filter: currentFilter,
        scrollTo: { slug: nextItem.slug },
      },
      replace: true,
    });
  }, [currentFilter, location.state?.from, navigate, nextItem, variant]);

  // Keep keyboard and side-screen pointer navigation available without hijacking body content.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName));

      if (isTypingTarget || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowLeft' && prevItem) {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight' && nextItem) {
        event.preventDefault();
        handleNext();
      }
    };

    const handleScreenClick = (event) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      if (event.target.closest('a, button, input, select, textarea, [role="button"], [contenteditable="true"]')) {
        return;
      }

      const third = window.innerWidth / 3;
      if (event.clientX < third) {
        handlePrevious();
      } else if (event.clientX >= third * 2) {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleScreenClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleScreenClick);
    };
  }, [handleClose, handleNext, handlePrevious, nextItem, prevItem]);

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

  const isOngoing = Boolean(data.isOngoing);
  const isWorkExperience = Boolean(data.isWorkExperience);

  const formatDetailDate = (dateString) => {
    if (!dateString) return 'Present';
    return formatDate(dateString, 'en-US', { monthYearOnly: true });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDetailDate(startDate);
    const end = formatDetailDate(endDate);

    // If both dates are the same, show only once
    if (start === end) {
      return start;
    }

    return `${start} - ${end}`;
  };

  const durationLabel =
    (data.duration ? formatDuration(data.duration) : null) ||
    (!isOngoing ? formatDateDifference(data.created, data.endDate) : null);
  const dateLabel = isWorkExperience
    ? data.endDate
      ? formatDateRange(data.startDate, data.endDate)
      : formatDetailDate(data.startDate)
    : data.endDate
      ? formatDateRange(data.created, data.endDate)
      : formatDetailDate(data.created);
  const scopeLabel = data.endDate
    ? isWorkExperience
      ? formatDateDifference(data.startDate, data.endDate)
      : durationLabel
    : null;

  return (
    <div className={`${pageLayout.page}`.trim()} style={{ gap: 'var(--stack-gap-2xl)' }}>
      <article className={`${pageLayout.container} ${styles.card}`.trim()}>
        <Button
          ref={setBackMag}
          icon="back"
          aria-label="Go back"
          onClick={handleClose}
          className={styles.goBackButton}
          variant="secondary"
          size="big"
        />

        {/* HEADER SECTION */}
        <header className={styles.header}>
          {/* Metadata */}
          <div className={styles.headerMetadata}>
            <div className={styles.titleDateRow}>
              <h3 ref={titleRef}>{data.title || data.company}</h3>
              <p className={styles.dateLabel}>{dateLabel}</p>
            </div>
            <div className={styles.metaPills}>
              {data.role && <Button label={data.role} variant="pill" size="xs" magnetic={false} />}
              {data.company && <Button label={data.company} variant="pill" size="xs" magnetic={false} />}
              {!data.role &&
                duties.map((duty) => <Button key={duty} label={duty} variant="pill" size="xs" magnetic={false} />)}
              {scopeLabel && <Button label={scopeLabel} variant="pill" size="xs" magnetic={false} />}
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
              {links.map((link, index) => (
                <Button
                  key={link.url}
                  label={link.label}
                  icon="external"
                  iconPosition="right"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  variant={index === 0 ? 'primary' : 'secondary'}
                  size="small"
                />
              ))}
            </div>
          )}
        </header>

        {/* SECTIONS */}
        {sections.length > 0 && (
          <div className={styles.sectionsContainer}>
            <div className={styles.sections}>
              {sections.map((section, sectionIndex) => {
                const hasSubheader = section.title || section.description;

                return (
                  <section key={sectionIndex} className={styles.section}>
                    {hasSubheader && (
                      <div className={styles.sectionSubheader}>
                        {section.title && <p className={styles.sectionTitle}>{section.title}</p>}
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
                      <div className={styles.sectionImages}>
                        {section.images.map((image, imageIndex) => (
                          <Media
                            key={`${sectionIndex}-${imageIndex}`}
                            src={image}
                            alt=""
                            className={styles.imageItem}
                            loading={sectionIndex === 0 && imageIndex === 0 ? 'eager' : 'lazy'}
                            fetchPriority={sectionIndex === 0 && imageIndex === 0 ? 'high' : 'auto'}
                            sizes="(max-width: 768px) 100vw, min(90vw, 1200px)"
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </article>

      {/* Footer with navigation */}
      {(prevItem || nextItem) && (
        <footer ref={footerRef} className={styles.detailFooter}>
          <nav className={`${styles.navigationSection} ${isNavDocked ? styles.navigationDocked : ''}`}>
            {prevItem && (
              <button
                ref={setPrevMag}
                type="button"
                onClick={handlePrevious}
                className={styles.navItem}
                onMouseEnter={() => {
                  previousCaptionScale.set(1.1);
                  previousCaptionOpacity.set(1);
                }}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const offsetX = event.clientX - rect.left;
                  const offsetY = event.clientY - rect.top;
                  previousCaptionX.set(offsetX);
                  previousCaptionY.set(offsetY);
                  previousCaptionRotate.set(-(offsetY - previousCaptionState.current.lastY) * 0.6);
                  previousCaptionState.current.lastY = offsetY;
                }}
                onMouseLeave={() => {
                  previousCaptionOpacity.set(0);
                  previousCaptionScale.set(1);
                  previousCaptionRotate.set(0);
                }}
                aria-label={`Previous: ${prevItem.company || prevItem.title}`}
              >
                <ArrowPreviousIcon className={styles.navArrow} />
                <span className={styles.navCaptionAnchor}>
                  <motion.span
                    className={styles.followCaption}
                    style={{
                      x: previousCaptionX,
                      y: previousCaptionY,
                      opacity: previousCaptionOpacity,
                      scale: previousCaptionScale,
                      rotate: previousCaptionRotate,
                    }}
                  >
                    use arrow keys
                  </motion.span>
                </span>
              </button>
            )}
            {nextItem && (
              <button
                ref={setNextMag}
                type="button"
                onClick={handleNext}
                className={`${styles.navItem} ${styles.navItemRight}`}
                onMouseEnter={() => {
                  nextCaptionScale.set(1.1);
                  nextCaptionOpacity.set(1);
                }}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const offsetX = event.clientX - (1.1*rect.left);
                  const offsetY = event.clientY - rect.top;
                  nextCaptionX.set(offsetX);
                  nextCaptionY.set(offsetY);
                  nextCaptionRotate.set(-(offsetY - nextCaptionState.current.lastY) * 0.6);
                  nextCaptionState.current.lastY = offsetY;
                }}
                onMouseLeave={() => {
                  nextCaptionOpacity.set(0);
                  nextCaptionScale.set(1);
                  nextCaptionRotate.set(0);
                }}
                aria-label={`Next: ${nextItem.company || nextItem.title}`}
              >
                {' '}
                <ArrowNextIcon className={styles.navArrow} />
                <span className={styles.navCaptionAnchor}>
                  <motion.span
                    className={`${styles.followCaption} ${styles.followCaptionRight}`}
                    style={{
                      x: nextCaptionX,
                      y: nextCaptionY,
                      opacity: nextCaptionOpacity,
                      scale: nextCaptionScale,
                      rotate: nextCaptionRotate,
                    }}
                  >
                    use arrow keys
                  </motion.span>
                </span>
              </button>
            )}
          </nav>
        </footer>
      )}
    </div>
  );
};

Detail.propTypes = {
  variant: PropTypes.oneOf(['work', 'playground']).isRequired,
};

export default Detail;

//<p className={styles.navTitle}>{nextItem.company || nextItem.title}</p>
//<p className={styles.navTitle}>{prevItem.company || prevItem.title}</p>
