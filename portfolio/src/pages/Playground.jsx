import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useRevealOnView from '@/hooks/useRevealOnView';
import Container from '@/components/ui/Container';
import CardGrid from '@/components/projects/CardGrid';
import ProjectCard from '@/components/projects/ProjectCard';
import Timeline from '@/components/ui/Timeline';
import { usePortfolio } from '@/contexts/PortfolioContext';
import styles from './Playground.module.css';
import pageLayout from '@/components/ui/PageLayout.module.css';
import { getMediaDimensions } from '@/utils/media';

const GRID_MIN_ROW_HEIGHT = 160;
const GRID_MAX_ROW_HEIGHT = 420;
const GRID_DEFAULT_ROW_HEIGHT = 240;
const GRID_GAP = 16;

const Playground = () => {
  const location = useLocation();
  const { playgrounds, loading, error } = usePortfolio();
  // const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [hoveredSlug, setHoveredSlug] = useState(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridGap, setGridGap] = useState(0);
  const [gridRowHeight, setGridRowHeight] = useState(GRID_DEFAULT_ROW_HEIGHT);
  const [visibleRowRange, setVisibleRowRange] = useState([0, 0]);
  const [measuredRatios, setMeasuredRatios] = useState({});
  // const [filterVisible, setFilterVisible] = useState(false);
  const gridRef = useRef(null);
  const zoomAnchorRef = useRef(null);
  const restoredSlugRef = useRef(null);
  const gridRowHeightRef = useRef(GRID_DEFAULT_ROW_HEIGHT);
  const zoomFrameRef = useRef(null);
  const zoomDeltaRef = useRef(0);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const computedStyle = window.getComputedStyle(grid);
      const rowGap = Number.parseFloat(computedStyle.columnGap);
      setGridWidth(entry.contentRect.width);
      setGridGap(Number.isFinite(rowGap) ? rowGap : 0);
    });
    observer.observe(grid);
    const computedStyle = window.getComputedStyle(grid);
    const initialGap = Number.parseFloat(computedStyle.columnGap);
    setGridGap(Number.isFinite(initialGap) ? initialGap : 0);
    setGridWidth(grid.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [loading, playgrounds.length]);

  const rowModel = useMemo(() => {
    if (!gridWidth || !playgrounds.length) return { rows: [], totalHeight: 0 };

    const gap = gridGap || GRID_GAP;
    const targetRowHeight = gridRowHeight;
    const ratios = playgrounds.map((item) => {
      const dimensions = getMediaDimensions(item.primaryImage?.[0]);
      return measuredRatios[item.slug] ||
        (dimensions?.width && dimensions?.height ? dimensions.width / dimensions.height : 1);
    });
    const rows = [];
    let row = [];
    let ratioSum = 0;

    ratios.forEach((ratio, index) => {
      const nextRatioSum = ratioSum + ratio;
      const nextGapWidth = row.length * gap;
      if (row.length && nextRatioSum * targetRowHeight + nextGapWidth > gridWidth) {
        rows.push({ items: row, ratioSum });
        row = [];
        ratioSum = 0;
      }
      row.push(index);
      ratioSum += ratio;
    });
    if (row.length) rows.push({ items: row, ratioSum });

    let nextTop = 0;
    const positionedRows = rows.map((currentRow, rowIndex) => {
      const isLastRow = rowIndex === rows.length - 1;
      const rowGapWidth = (currentRow.items.length - 1) * gap;
      const height = isLastRow
        ? Math.min(targetRowHeight, (gridWidth - rowGapWidth) / currentRow.ratioSum)
        : (gridWidth - rowGapWidth) / currentRow.ratioSum;
      const top = nextTop;
      nextTop += height + gap;

      return {
        top,
        height,
        items: currentRow.items.map((index) => ({
          item: playgrounds[index],
          layoutStyle: {
            '--card-width': `${ratios[index] * height}px`,
            '--row-height': `${height}px`,
          },
        })),
      };
    });
    return {
      rows: positionedRows,
      totalHeight: positionedRows.reduce((sum, row) => sum + row.height, 0) + Math.max(0, positionedRows.length - 1) * gap,
    };
  }, [gridGap, gridRowHeight, gridWidth, measuredRatios, playgrounds]);

  const handleMediaLoad = useCallback((slug, ratio) => {
    if (!slug || !Number.isFinite(ratio) || ratio <= 0) return;
    setMeasuredRatios((current) => (current[slug] === ratio ? current : { ...current, [slug]: ratio }));
  }, []);

  const updateVisibleRows = useCallback(() => {
    if (!gridRef.current || !rowModel.rows.length) {
      setVisibleRowRange([0, 0]);
      return;
    }
    const gridTop = gridRef.current.getBoundingClientRect().top + window.scrollY;
    const viewportTop = window.scrollY - gridTop;
    const viewportBottom = viewportTop + window.innerHeight;
    const overscan = window.innerHeight * 1.5;
    const start = Math.max(0, rowModel.rows.findIndex((row) => row.top + row.height >= viewportTop - overscan));
    const endIndex = rowModel.rows.findIndex((row) => row.top > viewportBottom + overscan);
    const end = endIndex === -1 ? rowModel.rows.length : endIndex;
    setVisibleRowRange((current) => (current[0] === start && current[1] === end ? current : [start, end]));
  }, [rowModel.rows]);

  useLayoutEffect(() => {
    updateVisibleRows();
  }, [updateVisibleRows]);

  useEffect(() => {
    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        updateVisibleRows();
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateVisibleRows, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateVisibleRows);
    };
  }, [updateVisibleRows]);

  useEffect(() => {
    gridRowHeightRef.current = gridRowHeight;
  }, [gridRowHeight]);

  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current;
    if (!anchor || !gridRef.current) return;

    const card = anchor.slug ? gridRef.current.querySelector(`[data-slug="${anchor.slug}"]`) : null;
    if (card) {
      const rect = card.getBoundingClientRect();
      const nextPoint = rect.top + rect.height * anchor.relativeY;
      window.scrollBy(0, nextPoint - anchor.clientY);
    } else if (typeof anchor.documentY === 'number') {
      window.scrollTo({ top: Math.max(0, anchor.documentY - anchor.clientY) });
    }
    zoomAnchorRef.current = null;
  }, [gridRowHeight, rowModel]);
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo && scrollTo.slug !== restoredSlugRef.current && gridRef.current) {
      const restoreTimer = setTimeout(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const targetCard = grid.querySelector(`[data-slug="${scrollTo.slug}"]`);
        if (targetCard) {
          const rect = targetCard.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = rect.height;
          const viewportHeight = window.innerHeight;
          const scrollPosition = elementTop - viewportHeight / 2 + elementHeight / 2;

          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth',
          });
          restoredSlugRef.current = scrollTo.slug;
          return;
        }

        const targetRow = rowModel.rows.find((row) => row.items.some(({ item }) => item.slug === scrollTo.slug));
        if (targetRow) {
          const gridTop = grid.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, gridTop + targetRow.top - window.innerHeight / 2 + targetRow.height / 2),
            behavior: 'smooth',
          });
          restoredSlugRef.current = scrollTo.slug;
        }
      }, 100);

      return () => clearTimeout(restoreTimer);
    }

    return undefined;
  }, [location.state?.scrollTo, rowModel]);

  const handleHoverChange = useCallback((slug) => {
    setHoveredSlug(slug ?? null);
  }, []);

  const handleZoomWheel = useCallback((event) => {
    // macOS trackpad pinch gestures arrive as Ctrl+wheel in browsers. Alt is
    // supported as a desktop fallback; ordinary scrolling remains untouched.
    if (!event.ctrlKey && !event.altKey) return;
    event.preventDefault();

    const anchor = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-slug]');
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      zoomAnchorRef.current = {
        slug: anchor.dataset.slug,
        clientY: event.clientY,
        relativeY: rect.height ? (event.clientY - rect.top) / rect.height : 0.5,
      };
    } else {
      zoomAnchorRef.current = {
        documentY: window.scrollY + event.clientY,
        clientY: event.clientY,
      };
    }

    zoomDeltaRef.current += event.deltaY;
    if (zoomFrameRef.current) return;

    zoomFrameRef.current = requestAnimationFrame(() => {
      const delta = zoomDeltaRef.current;
      zoomDeltaRef.current = 0;
      zoomFrameRef.current = null;
      const direction = delta < 0 ? 1 : -1;
      const multiplier = Math.pow(1.012, Math.min(24, Math.abs(delta)));
      const nextHeight = Math.min(
        GRID_MAX_ROW_HEIGHT,
        Math.max(
          GRID_MIN_ROW_HEIGHT,
          gridRowHeightRef.current * (direction > 0 ? multiplier : 1 / multiplier)
        )
      );
      setGridRowHeight(nextHeight);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleZoomWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', handleZoomWheel, { capture: true });
      if (zoomFrameRef.current) cancelAnimationFrame(zoomFrameRef.current);
    };
  }, [handleZoomWheel]);

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
      <Container className={styles.gridContainer}>
        {loading && <p className={styles.stateMessage}>Loading playgrounds…</p>}
        {error && !loading && <p className={styles.stateMessage}>Unable to load playgrounds right now.</p>}
        {!loading && !error && (
          <CardGrid
            ref={gridRef}
            className={styles.grid}
            data-hovered={hoveredSlug || 'none'}
          >
            <div className={styles.virtualGrid} style={{ height: `${rowModel.totalHeight}px` }}>
              {rowModel.rows.slice(visibleRowRange[0], visibleRowRange[1]).map((row, index) => {
                const rowIndex = visibleRowRange[0] + index;
                return (
                <div
                  key={`row-${rowIndex}`}
                  className={styles.virtualRow}
                  style={{ top: `${row.top}px`, height: `${row.height}px` }}
                >
                  {row.items.map(({ item, layoutStyle }) => (
                    <div
                      key={item.id || item.slug}
                      className={styles.virtualItem}
                      style={layoutStyle}
                    >
                      <ProjectCard
                        item={item}
                        variant="playground"
                        onHoverChange={handleHoverChange}
                        className={`${hoveredSlug && hoveredSlug !== item.slug ? styles.dimmed : ''}`.trim()}
                        layout="justified"
                        layoutStyle={layoutStyle}
                        loading={rowIndex < 2 ? 'eager' : 'lazy'}
                        fetchPriority={rowIndex < 2 ? 'high' : 'auto'}
                        onMediaLoad={handleMediaLoad}
                        data-created={item.created}
                      />
                    </div>
                  ))}
                </div>
                );
              })}
            </div>
          </CardGrid>
        )}
      </Container>
    </div>
  );
};

export default Playground;

// <Timeline playgrounds={playgrounds} />;
