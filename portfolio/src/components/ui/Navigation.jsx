import React, { useState, useRef, useEffect, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence

// Import the hook
import useMediaQuery from '@/hooks/useMediaQuery';
// Keep your other imports
import styles from './Navigation.module.css';
import {
  PlaygroundIcon,
  WorkIcon,
  AboutIcon,
  HomeIcon,
  NameIcon,
} from '@/assets/svgs/IconText';

// --- Constants ---
const MOBILE_BREAKPOINT_QUERY = '(max-width: 679.98px)'; // Equivalent to < 680px

// Define nav items outside the component for stability
const navItems = [
  { name: 'Home', path: '/', Icon: HomeIcon, DesktopIcon: NameIcon }, // Added DesktopIcon for clarity
  { name: 'Work', path: '/work', Icon: WorkIcon },
  { name: 'Playground', path: '/playground', Icon: PlaygroundIcon },
  { name: 'About', path: '/about', Icon: AboutIcon },
];

/* Subcomponent: BackgroundSlider */
const BackgroundSlider = memo(({ activeIndex, hoveredIndex, linkRefs }) => {
  const [animateProps, setAnimateProps] = useState({
    x: 0,
    width: 0,
    opacity: 0,
    filter: 'blur(5px)', // Start blurred and hidden
  });

  // Store precomputed positions to avoid recalculating layout on every hover/active change
  const linkPositions = useRef([]);

  useEffect(() => {
    // Precompute link positions when refs are available or change
    linkPositions.current = linkRefs.map((ref) => {
      if (ref.current) {
        return {
          offsetLeft: ref.current.offsetLeft,
          offsetWidth: ref.current.offsetWidth,
        };
      }
      return { offsetLeft: 0, offsetWidth: 0 }; // Fallback
    });
    // Re-calculate initial position based on activeIndex when positions are first computed
    // This handles the initial load case correctly
    const initialTargetIndex = activeIndex;
    const initialPosition = linkPositions.current[initialTargetIndex];
    const isInitialTargetHome = initialTargetIndex === 0;

    if (initialPosition) {
      setAnimateProps({
        x: initialPosition.offsetLeft,
        width: isInitialTargetHome ? 0 : initialPosition.offsetWidth,
        opacity: isInitialTargetHome ? 0 : 1,
        filter: isInitialTargetHome ? 'blur(5px)' : 'blur(0px)',
      });
    }
  }, [linkRefs, activeIndex]); // Depend on linkRefs and activeIndex for initial calculation

  useEffect(() => {
    // Determine the current target index (hover takes precedence over active)
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const position = linkPositions.current[targetIndex];
    const isTargetHome = targetIndex === 0; // Check if the target is the Home link (index 0)

    if (position) {
      if (isTargetHome) {
        // Home link specific style: move but hide/blur
        setAnimateProps({
          x: position.offsetLeft,
          width: 0, // Collapse width
          opacity: 0, // Make invisible
          filter: 'blur(5px)', // Apply blur
        });
      } else {
        // Other links: normal style
        setAnimateProps({
          x: position.offsetLeft,
          width: position.offsetWidth,
          opacity: 1,
          filter: 'blur(0px)', // No blur
        });
      }
    } else {
      // Fallback if position is somehow not found (shouldn't happen ideally)
      setAnimateProps({ x: 0, width: 0, opacity: 0, filter: 'blur(5px)' });
    }
  }, [activeIndex, hoveredIndex]); // Update slider whenever active or hovered index changes

  return (
    <motion.div
      className={styles.backgroundSlider}
      initial={false} // Don't use Framer Motion's initial animation, rely on useEffect
      animate={animateProps}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
  );
});
BackgroundSlider.displayName = 'BackgroundSlider'; // Add display name for better debugging

/* Subcomponent: NavLink */
const NavLink = memo(
  ({
    path,
    Icon,
    isActive,
    isHovered,
    setHoveredIndex,
    index,
    closeNav,
    refProp,
  }) => (
    <li // <--- Handlers are here
      ref={refProp}
      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
      onMouseEnter={() => setHoveredIndex(index)} // Triggers on li hover
      onMouseLeave={() => setHoveredIndex(null)} // Triggers on li hover leave
    >
      <Link to={path} onClick={closeNav} className={styles.navLink}>
        <Icon hovered={isHovered} />
      </Link>
    </li>
  )
);
NavLink.displayName = 'NavLink';

/* Subcomponent: NavList */
const NavList = memo(
  ({
    navItems,
    activeIndex,
    hoveredIndex,
    setHoveredIndex,
    closeNav,
    isMobile,
    linkRefs,
  }) => {
    // ... (your existing NavList code - verify it branches layout based on isMobile)
    const isActive = (index) => activeIndex === index;
    const isHovered = (index) => hoveredIndex === index;

    return (
      <div
        className={`${styles.navListContainer} ${
          isMobile ? styles.mobileContainer : styles.desktopContainer
        }`}
      >
        {/* Desktop Layout */}
        {!isMobile && (
          <>
            <ul className={styles.navLeft}>
              <NavLink
                index={0}
                path={navItems[0].path}
                Icon={navItems[0].DesktopIcon || navItems[0].Icon}
                isActive={isActive(0)}
                isHovered={isHovered(0)}
                setHoveredIndex={setHoveredIndex}
                closeNav={closeNav}
                refProp={linkRefs[0]}
              />
            </ul>
            <div className={styles.navLinksContainer}>
              <BackgroundSlider
                activeIndex={activeIndex}
                linkRefs={linkRefs}
                hoveredIndex={hoveredIndex}
              />
              <ul className={styles.navRight}>
                {navItems.slice(1).map((item, index) => (
                  <NavLink
                    key={item.path}
                    index={index + 1}
                    path={item.path}
                    Icon={item.Icon}
                    isActive={isActive(index + 1)}
                    isHovered={isHovered(index + 1)}
                    setHoveredIndex={setHoveredIndex}
                    closeNav={closeNav}
                    refProp={linkRefs[index + 1]}
                  />
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <ul className={styles.mobileNavList}>
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                index={index}
                path={item.path}
                Icon={item.Icon}
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
  }
);
NavList.displayName = 'NavList';


/* Subcomponent: BlurOverlay */
const BlurOverlay = memo(({ isMobile }) => (
  <div className={isMobile ? styles.gradientBlurReduced : styles.gradientBlur}>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index}></div>
    ))}
  </div>
));
BlurOverlay.displayName = 'BlurOverlay';


/* Subcomponent: MenuButton */
const MenuButton = memo(({ isNavOpen, toggleNav }) => (
  <button
    className={styles.menuButton}
    onClick={toggleNav}
    aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isNavOpen}
  >
    {/* Consider using an actual burger icon component here */}
    {isNavOpen ? 'Close' : 'Menu'}
  </button>
));
MenuButton.displayName = 'MenuButton';

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
      (location.pathname.startsWith('/playground/') &&
        item.path === '/playground') // Handle active state for nested playground routes
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

  return (
    // Apply class based on `isMobile` state
    <nav
      className={`${styles.nav} ${isMobile ? styles.mobile : styles.desktop}`}
    >
      {/* Pass isMobile prop instead of isReduced */}
      <BlurOverlay isMobile={isMobile} />
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
            <Link
              to="/"
              className={styles.mobileHomeIcon}
              onClick={closeNav}
              aria-label="Home"
            >
              <NameIcon />
            </Link>
            <MenuButton isNavOpen={isNavOpen} toggleNav={toggleNav} />

            {/* Use AnimatePresence for smooth open/close */}
            <AnimatePresence>
              {isNavOpen && (
                <motion.div
                  key="mobile-nav-list" // Add key for AnimatePresence
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={styles.mobileNavWrapper}
                >
                  <NavList
                    navItems={navItems}
                    activeIndex={activeIndex}
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                    closeNav={closeNav} // Mobile links should close the nav
                    isMobile={true}
                    linkRefs={linkRefs.current}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation);

