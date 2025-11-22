import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useRevealOnView from '@/hooks/useRevealOnView';
import RevealAnimation from '@/components/utility/RevealAnimation';
import Container from '@/components/ui/Container';
import CardGrid from '@/components/projects/CardGrid';
import ProjectCard from '@/components/projects/ProjectCard';
import { usePortfolio } from '@/contexts/PortfolioContext';
import styles from './Playground.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import Button from '@/components/ui/Button';

const ALL_CATEGORY = 'all';

const formatCategoryLabel = (category) => {
  if (category === ALL_CATEGORY) return 'All';
  return category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const playgroundParagraphs = [
  "Drawing has always been a part of me, more than a hobby, it just feels right. Eighteen years in, I keep growing at my own pace, always striving for more. I don't post much online, but I create whenever I can. ",
  "Lately, I've been channeling that energy into UX/UI design, another canvas for balance, structure, and emotion. The process, the curiosity, the joy of making, that's what drives me.",
];

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
    <div className={pageLayout.page}>
      <Container className={pageLayout.pageHeader}>
        <RevealAnimation cascade damping={0.1} triggerOnce>
          {playgroundParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </RevealAnimation>
      </Container>

      <Container className={styles.gridContainer}>
        {loading && <p className={styles.stateMessage}>Loading playgrounds…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load playgrounds right now.</p>}
        {!loading && !error && (
          <CardGrid ref={gridRef} className={styles.grid} data-hovered={hoveredSlug || 'none'}>
            <RevealAnimation triggerOnce={false} duration={400}>
              {filteredPlaygrounds.map((item) => (
                <ProjectCard
                  key={item.id || item.slug}
                  item={item}
                  variant="playground"
                  onHoverChange={handleHoverChange}
                  className={`${hoveredSlug && hoveredSlug !== item.slug ? styles.dimmed : ''}`.trim()}
                />
              ))}
            </RevealAnimation>
          </CardGrid>
        )}
      </Container>

      <div
        className={`${styles.filterBar} ${filterVisible ? styles.visible : ''}`}
        role="toolbar"
        aria-label="Filtrer les playgrounds"
      >
        <ul className={styles.filterList}>
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <li key={category}>
                <Button
                  type="button"
                  label={formatCategoryLabel(category)}
                  onClick={() => handleCategoryChange(category)}
                  className={`${styles.filterButton} ${isActive ? styles.active : ''}`.trim()}
                  aria-pressed={isActive}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Playground;
