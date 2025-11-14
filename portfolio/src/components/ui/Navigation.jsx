import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import useMediaQuery from '@/hooks/useMediaQuery';
import styles from './Navigation.module.css';
import { CloseIcon } from '@/components/ui/icons';

// --- Constants ---
const MOBILE_BREAKPOINT_QUERY = '(max-width: 679.98px)'; // Equivalent to < 680px

// Define nav items outside the component for stability
const navItems = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work' },
  { name: 'playground', path: '/playground' },
  { name: 'about', path: '/about' },
];

/* Subcomponent: BackgroundSlider */
const BackgroundSlider = memo(({ activeIndex, hoveredIndex, linkRefs, containerRef, hideHome, isMobile }) => {
  const paddingX = isMobile ? 24 : 0;
  const paddingY = isMobile ? 6 : 0;

  const [animateProps, setAnimateProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0,
    filter: 'blur(5px)',
  });

  const linkPositions = useRef([]);

  const computePositions = useCallback(() => {
    const container = containerRef?.current;
    if (!container) return [];

    const containerRect = container.getBoundingClientRect();

    return linkRefs.map((ref) => {
      if (!ref?.current) {
        return null;
      }

      const element = ref.current;
      const rect = element.getBoundingClientRect();

      const width = Math.min(rect.width + paddingX * 2, containerRect.width);
      const height = rect.height + paddingY * 2;
      const x = Math.max(rect.left - containerRect.left - paddingX, 0);
      const y = Math.max(rect.top - containerRect.top - paddingY, 0);

      return {
        x,
        y,
        width,
        height,
      };
    });
  }, [containerRef, linkRefs, paddingX, paddingY]);

  const updateForIndex = useCallback(
    (index, positions = linkPositions.current) => {
      if (!Array.isArray(positions) || positions.length === 0) {
        setAnimateProps((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      if (index == null || index < 0) {
        setAnimateProps((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const position = positions[index];
      const shouldHide = hideHome && index === 0;

      if (position) {
        if (shouldHide) {
          setAnimateProps({
            x: position.x,
            y: position.y,
            width: 0,
            height: 0,
            opacity: 0,
            filter: 'blur(5px)',
          });
        } else {
          setAnimateProps({
            x: position.x,
            y: position.y,
            width: Math.max(position.width, 1),
            height: Math.max(position.height, 1),
            opacity: 1,
            filter: 'blur(0px)',
          });
        }
      } else {
        setAnimateProps((prev) => ({ ...prev, opacity: 0 }));
      }
    },
    [hideHome]
  );

  useLayoutEffect(() => {
    const positions = computePositions();
    linkPositions.current = positions;
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    updateForIndex(targetIndex, positions);
  }, [activeIndex, hoveredIndex, computePositions, updateForIndex]);

  useEffect(() => {
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    updateForIndex(targetIndex);
  }, [activeIndex, hoveredIndex, updateForIndex]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      const positions = computePositions();
      linkPositions.current = positions;
      const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
      updateForIndex(targetIndex, positions);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [activeIndex, hoveredIndex, computePositions, updateForIndex, containerRef]);

  return (
    <motion.div
      className={styles.backgroundSlider}
      initial={false}
      animate={animateProps}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
  );
});
BackgroundSlider.displayName = 'BackgroundSlider'; // Add display name for better debugging

/* Subcomponent: NavLink */
const NavLink = memo((props) => {
  const { path, label, ariaLabel, isActive, isHovered, setHoveredIndex, index, closeNav, refProp } = props;

  return (
    <li
      ref={refProp}
      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Link
        to={path}
        onClick={closeNav}
        className={styles.navLink}
        aria-current={isActive ? 'page' : undefined}
        aria-label={ariaLabel}
      >
        <span className={`${styles.navLabel} ${isHovered ? styles.hovered : ''}`}>{label}</span>
      </Link>
    </li>
  );
});
NavLink.displayName = 'NavLink';

/* Subcomponent: NavList */
const NavList = memo(({ navItems, activeIndex, hoveredIndex, setHoveredIndex, closeNav, isMobile, linkRefs }) => {
  const containerRef = useRef(null);

  const isActive = (index) => activeIndex === index;
  const isHovered = (index) => hoveredIndex === index;

  return (
    <div
      ref={containerRef}
      className={`${styles.navListContainer} ${isMobile ? styles.mobileContainer : styles.desktopContainer}`}
    >
      <BackgroundSlider
        activeIndex={activeIndex}
        hoveredIndex={hoveredIndex}
        linkRefs={linkRefs}
        containerRef={containerRef}
        hideHome={!isMobile}
        isMobile={isMobile}
      />

      {!isMobile && (
        <>
          <ul className={styles.navLeft}>
            <NavLink
              index={0}
              path={navItems[0].path}
              label="Floria Leger"
              ariaLabel={navItems[0].name}
              isActive={isActive(0)}
              isHovered={isHovered(0)}
              setHoveredIndex={setHoveredIndex}
              closeNav={closeNav}
              refProp={linkRefs[0]}
            />
          </ul>
          <ul className={styles.navRight}>
            {navItems.slice(1).map((item, index) => (
              <NavLink
                key={item.path}
                index={index + 1}
                path={item.path}
                label={item.name}
                isActive={isActive(index + 1)}
                isHovered={isHovered(index + 1)}
                setHoveredIndex={setHoveredIndex}
                closeNav={closeNav}
                refProp={linkRefs[index + 1]}
              />
            ))}
          </ul>
        </>
      )}

      {isMobile && (
        <ul className={styles.mobileNavList}>
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              index={index}
              path={item.path}
              label={item.name}
              isActive={isActive(index)}
              isHovered={isHovered(index)}
              setHoveredIndex={setHoveredIndex}
              closeNav={closeNav}
              refProp={linkRefs[index]}
            />
          ))}
        </ul>
      )}
    </div>
  );
});
NavList.displayName = 'NavList';

/* Subcomponent: BlurOverlay */
const BlurOverlay = memo(() => (
  <div className={styles.gradientBlur}>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index}></div>
    ))}
  </div>
));
BlurOverlay.displayName = 'BlurOverlay';

/* Subcomponent: MenuTrigger */
const MenuTrigger = memo(({ isNavOpen, toggleNav }) => (
  <h3 className={styles.menuTriggerHeading}>
    <button
      type="button"
      className={styles.menuTrigger}
      onClick={toggleNav}
      aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isNavOpen}
    >
      <span className={styles.menuTriggerLabel}>Menu</span>
    </button>
  </h3>
));
MenuTrigger.displayName = 'MenuTrigger';

/* Subcomponent: CloseButton */
const CloseButton = memo(({ onClick }) => (
  <button type="button" className={styles.mobileCloseButton} onClick={onClick} aria-label="Close menu">
    {/* larger close icon for better tap target visibility */}
    <CloseIcon className={styles.mobileCloseSvg} size={40} title="Close menu" />
  </button>
));
CloseButton.displayName = 'CloseButton';

/* Main Component: Navigation */
const Navigation = () => {
  // Use useMediaQuery hook
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();
  const linkRefs = useRef(navItems.map(() => React.createRef()));

  const activeIndex = navItems.findIndex(
    (item) =>
      item.path === location.pathname ||
      (location.pathname.startsWith('/work/') && item.path === '/work') || // Handle active state for nested work routes
      (location.pathname.startsWith('/playground/') && item.path === '/playground') // Handle active state for nested playground routes
  );

  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const closeNav = () => {
    setIsNavOpen(false);
    setHoveredIndex(null);
  };

  // Effect to close mobile nav on route change (if mobile)
  useEffect(() => {
    if (isMobile) {
      closeNav(); // Close nav and reset hover
    }
  }, [location.pathname, isMobile]); // Rerun if path changes or crosses breakpoint

  // Effect to close mobile nav if window resized to desktop while open
  useEffect(() => {
    if (!isMobile && isNavOpen) {
      setIsNavOpen(false); // Only change open state, hover reset isn't needed
    }
  }, [isMobile, isNavOpen]);

  useEffect(() => {
    if (isMobile && isNavOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    document.body.style.overflow = '';
    return undefined;
  }, [isMobile, isNavOpen]);

  return (
    // Apply class based on `isMobile` state
    <nav className={`${styles.nav} ${isMobile ? styles.mobile : styles.desktop}`}>
      <BlurOverlay />
      <div className={styles.navContainer}>
        {/* --- Desktop Navigation --- */}
        {!isMobile && (
          <NavList
            navItems={navItems}
            activeIndex={activeIndex}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            closeNav={() => setHoveredIndex(null)} // Desktop links don't close nav, just clear hover
            isMobile={false}
            linkRefs={linkRefs.current}
          />
        )}

        {/* --- Mobile Navigation --- */}
        {isMobile && (
          <>
            <MenuTrigger isNavOpen={isNavOpen} toggleNav={toggleNav} />

            {/* Use AnimatePresence for smooth open/close */}
            <AnimatePresence>
              {isNavOpen && (
                <motion.aside
                  key="mobile-nav-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.mobileNavOverlay}
                >
                  <div className={styles.mobileNavInner}>
                    <NavList
                      navItems={navItems}
                      activeIndex={activeIndex}
                      hoveredIndex={hoveredIndex}
                      setHoveredIndex={setHoveredIndex}
                      closeNav={closeNav} // Mobile links should close the nav
                      isMobile={true}
                      linkRefs={linkRefs.current}
                    />
                    <CloseButton onClick={closeNav} />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation);
