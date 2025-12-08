import { useState, useEffect, useCallback } from 'react';
import styles from './Timeline.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = new Date().getFullYear();

const Timeline = ({ playgrounds = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Get month and year from date string (YYYY-MM-DD)
  const getMonthAndYear = useCallback((dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return { month: date.getMonth(), year: date.getFullYear() };
  }, []);

  // Build timeline entries (all year-months with content)
  const timelineEntries = useCallback(() => {
    const entriesMap = new Map();

    playgrounds.forEach((item) => {
      const dateInfo = getMonthAndYear(item.created);
      if (dateInfo) {
        const key = `${dateInfo.year}-${dateInfo.month}`;
        if (!entriesMap.has(key)) {
          entriesMap.set(key, { year: dateInfo.year, month: dateInfo.month, items: [] });
        }
        entriesMap.get(key).items.push(item);
      }
    });

    // Sort by year and month (newest first: Dec 2025, Nov 2025, ... Jan 2024, ...)
    return Array.from(entriesMap.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [playgrounds, getMonthAndYear]);

  // Calculate current visible month based on scroll position
  useEffect(() => {
    let scrollTimer;
    const entries = timelineEntries();

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);

      const viewportHeight = window.innerHeight;

      // Find all playground items on the page
      const items = document.querySelectorAll('[data-created]');
      let closestIndex = null;
      let closestDistance = Infinity;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          const dateStr = item.getAttribute('data-created');
          const dateInfo = getMonthAndYear(dateStr);
          if (dateInfo) {
            // Find which entry index this corresponds to
            const entryIndex = entries.findIndex((e) => e.year === dateInfo.year && e.month === dateInfo.month);
            if (entryIndex !== -1) {
              closestIndex = entryIndex;
            }
          }
        }
      });

      if (closestIndex !== null) {
        setScrollIndex(closestIndex);
      }

      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [getMonthAndYear, timelineEntries]);

  // Scroll to specific year-month
  const scrollToEntry = useCallback(
    (entry) => {
      const items = document.querySelectorAll('[data-created]');
      let targetItem = null;

      // Find first item in the target year-month
      for (const item of items) {
        const dateStr = item.getAttribute('data-created');
        const dateInfo = getMonthAndYear(dateStr);
        if (dateInfo && dateInfo.month === entry.month && dateInfo.year === entry.year) {
          targetItem = item;
          break;
        }
      }

      if (targetItem) {
        const rect = targetItem.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const scrollPosition = elementTop - viewportHeight / 2 + elementHeight / 2;

        window.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
      }
    },
    [getMonthAndYear]
  );

  const calculateScale = (index) => {
    const activeIndex = hoveredIndex !== null ? hoveredIndex : isScrolling ? scrollIndex : null;
    if (activeIndex === null) return 0.4;
    const distance = Math.abs(index - activeIndex);
    return Math.max(1 - distance * 0.2, 0.4);
  };

  const entries = timelineEntries();

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineTrack}>
        {entries.map((entry, i) => {
          const key = `${entry.year}-${entry.month}`;
          const isActive = i === scrollIndex && isScrolling;
          const scale = calculateScale(i);
          const monthName = MONTHS[entry.month];

          return (
            <button
              key={key}
              className={styles.timelineItem}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => scrollToEntry(entry)}
              aria-label={`${monthName} ${entry.year}`}
            >
              <span
                className={`${styles.timelineMark} ${isActive ? styles.active : ''}`}
                style={{
                  transform: `scaleX(${scale}) scaleY(1)`,
                }}
              />
              {hoveredIndex === i && hoveredIndex !== null && (
                <span className={`${styles.timelineLabel} ${isActive ? styles.active : ''}`}>
                  {monthName}, {entry.year}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
