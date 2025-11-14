import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import navStyles from '@/components/ui/Navigation.module.css';
import useRevealOnView from '@/hooks/useRevealOnView';
import Container from '@/components/ui/Container';
import CardGrid from '@/components/projects/CardGrid';
import ProjectCard from '@/components/projects/ProjectCard';
import { usePortfolio } from '@/contexts/PortfolioContext';
import styles from './Playground.module.css';

const ALL_CATEGORY = 'all';

const formatCategoryLabel = (category) => {
  if (category === ALL_CATEGORY) return 'All';
  return category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

/* gradient blur overlay intentionally removed in favor of a CSS pseudo-element */

const Playground = () => {
  const { playgrounds, uniquePlaygroundCategories, loading, error } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [hoveredSlug, setHoveredSlug] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const gridRef = useRef(null);
  const thresholdRef = useRef({ thresholdY: 0, scrollTarget: 0 });

  const categories = useMemo(() => [ALL_CATEGORY, ...uniquePlaygroundCategories], [uniquePlaygroundCategories]);

  const filteredPlaygrounds = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) return playgrounds;
    return playgrounds.filter((item) => item.type === selectedCategory);
  }, [playgrounds, selectedCategory]);

  const recomputeThreshold = useCallback(() => {
    if (!gridRef.current) return;
    const firstCard = gridRef.current.querySelector('[data-slug]');
    if (!firstCard) {
      thresholdRef.current = { thresholdY: 0, scrollTarget: 0 };
      return;
    }

    const gridRect = gridRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const gridTop = gridRect.top + scrollTop;
    const cardHeight = firstCard.offsetHeight;
    const computed = window.getComputedStyle(gridRef.current);
    const rowGap = parseFloat(computed.rowGap || computed.gap || '0');
    const thresholdY = gridTop + cardHeight + rowGap + 32; // after first row + spacing
    const scrollTarget = Math.max(thresholdY - window.innerHeight, 0);
    thresholdRef.current = { thresholdY, scrollTarget };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      recomputeThreshold();
    };

    window.addEventListener('resize', handleResize);
    const raf = window.requestAnimationFrame(() => recomputeThreshold());

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [recomputeThreshold, filteredPlaygrounds.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleScroll = () => {
      if (!thresholdRef.current.thresholdY) {
        recomputeThreshold();
      }
      const { thresholdY } = thresholdRef.current;
      if (!thresholdY) {
        setFilterVisible(false);
        return;
      }
      const viewportBottom = window.scrollY + window.innerHeight;
      setFilterVisible((prev) => {
        const shouldShow = viewportBottom >= thresholdY;
        return prev === shouldShow ? prev : shouldShow;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [recomputeThreshold]);

  const handleHoverChange = useCallback((slug) => {
    setHoveredSlug(slug ?? null);
  }, []);

  const handleCategoryChange = useCallback(
    (category) => {
      if (category === selectedCategory) return;
      setSelectedCategory(category);
      setHoveredSlug(null);
      if (filterVisible && typeof window !== 'undefined') {
        const { scrollTarget } = thresholdRef.current;
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
      window.requestAnimationFrame(() => recomputeThreshold());
    },
    [filterVisible, recomputeThreshold, selectedCategory]
  );
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeaderVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Reveal playground cards when they enter the viewport.
  // We target the inner visual wrapper with [data-reveal-target] so
  // the outer card element (which handles hover/dimming) remains untouched.
  useRevealOnView(gridRef, {
    itemSelector: '[data-slug]',
    targetSelector: '[data-reveal-target]',
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.06,
    stagger: 80,
    once: true,
  });

  return (
    <div className={styles.playgroundPage}>
      {/* Fixed mirrored gradient blur anchored to the viewport bottom.
          Render the same inner structure used by the navigation blur (six stacked layers)
          so the masks and backdrop-filter settings are preserved. */}
      <div
        className={navStyles.gradientBlurBottom}
        aria-hidden="true"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: 'var(--nav-height)',
          background: 'transparent',
          zIndex: 1,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} />
        ))}
      </div>
      <Container className={`${styles.pageHeader} reveal-hero ${headerVisible ? 'is-visible' : ''}`}>
        <p>
          I've been passionate about drawing for eighteen years now. Behind this rather simple word lies a world of
          incredibly talented artists whom I admire, even if I don't claim to be on their level. I try to progress at my
          own pace, doing my best.
        </p>
        <p>
          Although I rarely share my work on social networks, for lack of time and because that's not really my thing, I
          still enjoy drawing on my own whenever I get the chance.
        </p>
        <p>
          Over the last three years, I feel I've really progressed, and without pretension, I'm pretty proud of that!
          But compared with the ease and speed I'd like to achieve, I've still got a long way to go.
        </p>
        <p>
          Until I reach those heights, here are my latest little creations that I'd like to show you! I hope you like
          them!
        </p>
      </Container>

      <Container className={styles.gridContainer}>
        {loading && <p className={styles.stateMessage}>Loading playgrounds…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load playgrounds right now.</p>}
        {!loading && !error && (
          <CardGrid ref={gridRef} className={styles.grid} data-hovered={hoveredSlug || 'none'}>
            {filteredPlaygrounds.map((item) => (
              <ProjectCard
                key={item.id || item.slug}
                item={item}
                variant="playground"
                onHoverChange={handleHoverChange}
                className={`${hoveredSlug && hoveredSlug !== item.slug ? styles.dimmed : ''}`.trim()}
              />
            ))}
          </CardGrid>
        )}
      </Container>

      <div
        className={`${styles.filterBar} ${filterVisible ? styles.visible : ''}`}
        role="toolbar"
        aria-label="Filtrer les playgrounds"
      >
        <div className={styles.filterShell}>
          <div className={styles.filterBackdrop} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <ul className={styles.filterList}>
            {categories.map((category) => {
              const isActive = category === selectedCategory;
              return (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`${styles.filterButton} ${isActive ? styles.active : ''}`.trim()}
                    aria-pressed={isActive}
                  >
                    {formatCategoryLabel(category)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {/* CSS pseudo-element on .filterBar renders the mirrored gradient – no extra DOM node needed */}
      </div>
    </div>
  );
};

export default Playground;
