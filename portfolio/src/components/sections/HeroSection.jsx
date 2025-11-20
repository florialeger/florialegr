import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/Container';
import heroImageOne from '@/assets/images/home-1.png';
import heroImageTwo from '@/assets/images/home-2.png';
import heroImageThree from '@/assets/images/home-3.png';
import heroImageFour from '@/assets/images/home-4.png';
import styles from './HeroSection.module.css';

const heroImages = [
  { id: 'ux-primary', src: heroImageOne, type: 'ux', className: styles.heroImagePrimary },
  { id: 'illustration-primary', src: heroImageTwo, type: 'illustration', className: styles.heroImageSecondary },
  { id: 'ux-secondary', src: heroImageThree, type: 'ux', className: styles.heroImageTertiary },
  { id: 'illustration-secondary', src: heroImageFour, type: 'illustration', className: styles.heroImageQuaternary },
];

const HeroSection = () => {
  const [hoveredType, setHoveredType] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [mountedVisible, setMountedVisible] = useState(false);
  const visualRef = useRef(null);
  const animationFrameRef = useRef(null);
  // useBlurReveal removed — no-op ref setter
  const setRevealNode = () => {};

  const applyPointer = useCallback((x, y) => {
    if (!visualRef.current) return;
    visualRef.current.style.setProperty('--pointer-x', x.toFixed(3));
    visualRef.current.style.setProperty('--pointer-y', y.toFixed(3));
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      if (!visualRef.current) return;
      const rect = visualRef.current.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => {
        applyPointer(relativeX, relativeY);
        animationFrameRef.current = null;
      });
    },
    [applyPointer]
  );

  const resetPointer = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      applyPointer(0, 0);
      animationFrameRef.current = null;
    });
  }, [applyPointer]);

  useEffect(
    () => () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    },
    []
  );

  const handleImageEnter = useCallback((index, type) => {
    setHoveredType(type);
    setActiveIndex(index);
  }, []);

  const handleImageLeave = useCallback(() => {
    setHoveredType(null);
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    // trigger a CSS-driven mount animation on next frame
    const id = requestAnimationFrame(() => setMountedVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={setRevealNode}
      className={`${styles.hero} reveal-hero ${mountedVisible ? 'is-visible' : ''}`}
      aria-labelledby="hero-title"
      data-hovered={hoveredType || 'none'}
    >
      <Container className={styles.heroContainer}>
        <div
          className={styles.heroVisual}
          ref={visualRef}
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            handleImageLeave();
            resetPointer();
          }}
        >
          {heroImages.map(({ id, src, type, className }, index) => (
            <div
              key={id}
              className={`${styles.heroImageWrapper} ${className}`.trim()}
              data-type={type}
              data-active={activeIndex === index}
              onPointerEnter={() => handleImageEnter(index, type)}
              onPointerLeave={handleImageLeave}
            >
              <img src={src} alt="" loading="lazy" className={styles.heroImageMedia} />
            </div>
          ))}
        </div>

          <h1 id="hero-title" className={styles.heroTitle}>
            <span className={styles.heroTitleUpper}>UX/UI Designer</span>
            <span className={styles.heroTitleAmpersand} aria-hidden="true">
              &
            </span>
            <span className={styles.heroTitleLower}>Digital Illustrator</span>
          </h1>
      </Container>
    </section>
  );
};

export default memo(HeroSection);
