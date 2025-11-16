import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { usePortfolio } from '@/contexts/PortfolioContext';
// useBlurReveal removed
import formatDate from '@/utils/formatDate';
import formatDuration from '@/utils/formatDuration';
import { resolveSupportIcons } from '@/utils/supportIcons';
import { resolveMediaPath } from '@/utils/media';
// ThemeSwitcher temporarily hidden. Uncomment import below to re-enable the theme picker.
// import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import styles from './Detail.module.css';
import useMagneticEffect from '@/hooks/useMagneticEffect';
import Media from '@/components/ui/Media';

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

  const supports = useMemo(() => {
    const raw = resolveSupportIcons(data?.support || []);
    // always prefer to show Procreate, Figma, Paper in that order when present
    const preferred = ['Procreate', 'Figma', 'Paper'];
    const ordered = [];

    // push preferred in order if present
    preferred.forEach((label) => {
      const found = raw.find((s) => s.label === label);
      if (found) ordered.push(found);
    });

    // append remaining icons preserving their original order
    raw.forEach((s) => {
      if (!ordered.includes(s)) ordered.push(s);
    });

    return ordered;
  }, [data]);
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

  // Align the fixed back arrow with the title position (updates on resize/scroll)
  // Back button is now centered in a bottom bar; no dynamic alignment needed.

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
      <div className={styles.detailPage}>
        <article className={styles.card} data-empty>
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

  // For works we show the precise launch date (month + day + year when available).
  // For playgrounds we only want month + year (no precise day), even if a full date exists.
  const createdLabel = data.created
    ? variant === 'work'
      ? formatDate(data.created)
      : formatDate(data.created, 'en-US', { monthYearOnly: true })
    : 'Unknown';

  const durationLabel = data.duration ? formatDuration(data.duration) : null;
  return (
    <div className={styles.detailPage}>
      {/* Navigation gradient blur intentionally not rendered on Detail page. */}

      {/* Bottom bar that contains the centered Back control (mirrors Playground filter placement). */}
      <div className={styles.bottomBar} role="toolbar" aria-label="Navigation">
        <div className={styles.bottomShell}>
          <div className={styles.bottomBackdrop} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.bottomList}>
            <button
              ref={setBackMag}
              type="button"
              onClick={handleClose}
              className={styles.backTextButton}
              aria-label="Back"
              title="Back"
            >
              Back
            </button>
          </div>
        </div>
      </div>
      <article className={styles.card}>
        <div className={styles.scrollArea}>
          <header className={styles.header} data-condensed={isHeaderCondensed}>
            <div className={styles.headerInner}>
              <div className={styles.headerPrimary}>
                <div className={styles.headerRow}>
                  <div className={styles.titleBlock}>
                    <h3 ref={titleRef}>{data.title}</h3>
                  </div>
                  {duties.length > 0 && (
                    <ul className={styles.badgeList}>
                      {duties.map((duty) => (
                        <li key={duty}>{duty}</li>
                      ))}
                    </ul>
                  )}{' '}
                </div>
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
                {/* Theme wheel temporarily hidden to force light mode.
                  To re-enable, uncomment the import at the top and this component:
                  <ThemeSwitcher /> */}
                <dl className={styles.metaList}>
                  {variant === 'work' ? (
                    <div className={styles.metaItem}>
                      <dt>launch</dt>
                      <dd>{createdLabel}</dd>
                    </div>
                  ) : (
                    <div className={styles.metaItem}>
                      <dd>{createdLabel}</dd>
                    </div>
                  )}
                  {durationLabel && (
                    <div className={styles.metaItem}>
                      <dt>duration</dt>
                      <dd>{durationLabel}</dd>
                    </div>
                  )}
                </dl>
              </div>
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
                      <Button key={link.url} label={link.label} href={link.url} target="_blank" rel="noreferrer" />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {galleryImages.length > 0 && (
            <section className={styles.gallery}>
              <ul ref={imageGridRef} className={styles.imageGrid}>
                {(() => {
                  const isSingleInGrid = galleryImages.length === 1;
                  return galleryImages.map((image, index) => {
                    const wideClass = isSingleInGrid || index % 3 === 2 ? styles.imageWide : '';
                    return (
                      <li key={`${image}-${index}`} className={`${wideClass}`.trim()}>
                        <MagneticImage className={styles.imageItem} src={image} alt="">
                          <Media src={image} alt="" className={styles.imageItem} />
                        </MagneticImage>
                      </li>
                    );
                  });
                })()}
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
