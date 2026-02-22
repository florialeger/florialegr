import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealAnimation from '@/components/utility/RevealAnimation';
import Container from '@/components/ui/Container';
import TextMorph from '@/components/utility/TextMorph';
import homeUx1 from '@/assets/images/home-ux-1.png';
import homeUx2 from '@/assets/images/home-ux-2.png';
import homeUx3 from '@/assets/images/home-ux-3.png';
import homeIllu1 from '@/assets/images/home-illu-1.png';
import homeIllu2 from '@/assets/images/home-illu-2.png';
import homeIllu3 from '@/assets/images/home-illu-3.png';
import styles from './HeroSection.module.css';
import Button from '@/components/ui/Button';

const HeroSection = () => {
  const [hoveredType, setHoveredType] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const visualRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

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

  const handleEmailCopy = useCallback(async () => {
    const email = 'floria.leger@ensc.fr';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }, []);

  const handleHoverEnter = useCallback((type) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredType(type);
  }, []);

  const handleHoverLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredType(null);
      hoverTimeoutRef.current = null;
    }, 300);
  }, []);

  useEffect(
    () => () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    },
    []
  );

  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-hovered={hoveredType || 'none'}>
      <Container className={styles.heroContainer}>
        <RevealAnimation cascade damping={0.12} delay={0} triggerOnce>
          <h1 id="hero-title" className={styles.heroTitle}>
            <span
              className={styles.heroTitleUpper}
              onPointerEnter={() => handleHoverEnter('ux')}
              onPointerLeave={handleHoverLeave}
            >
              UX/UI Designer
            </span>
            <span className={styles.heroTitleAmpersand} aria-hidden="true">
              &
            </span>
            <span
              className={styles.heroTitleLower}
              onPointerEnter={() => handleHoverEnter('illustration')}
              onPointerLeave={handleHoverLeave}
            >
              Digital Illustrator
            </span>
          </h1>
          <div
            className={styles.heroVisual}
            ref={visualRef}
            aria-hidden="true"
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
          >
            <AnimatePresence mode="wait">
              {!hoveredType && (
                <>
                  <motion.div
                    key="ux-default"
                    className={`${styles.heroImageWrapper} ${styles.heroImageLeft}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={homeUx1} alt="" loading="lazy" className={styles.heroImageMedia} />
                  </motion.div>
                  <motion.div
                    key="illu-default"
                    className={`${styles.heroImageWrapper} ${styles.heroImageRight}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={homeIllu1} alt="" loading="lazy" className={styles.heroImageMedia} />
                  </motion.div>
                </>
              )}
              {hoveredType === 'ux' && (
                <>
                  <motion.div
                    key="ux-2"
                    className={`${styles.heroImageWrapper} ${styles.heroImageLeft}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={homeUx2} alt="" loading="lazy" className={styles.heroImageMedia} />
                  </motion.div>
                  <motion.div
                    key="ux-3"
                    className={`${styles.heroImageWrapper} ${styles.heroImageRight}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={homeUx3} alt="" loading="lazy" className={styles.heroImageMedia} />
                  </motion.div>
                </>
              )}
              {hoveredType === 'illustration' && (
                <>
                  <motion.div
                    key="illu-2"
                    className={`${styles.heroImageWrapper} ${styles.heroImageLeft}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={homeIllu2} alt="" loading="lazy" className={styles.heroImageMedia} />
                  </motion.div>
                  <motion.div
                    key="illu-3"
                    className={`${styles.heroImageWrapper} ${styles.heroImageRight}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <img src={homeIllu3} alt="" loading="lazy" className={styles.heroImageMedia} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <h3 className={styles.heroSubtitle}>
            Merging human psychology and UI to craft data-driven experiences, leveraging 3+ years of UX design and a
            deep expertise in illustration.
          </h3>
          <div className={styles.buttonWrapper}>
            <Button
              variant="secondary"
              size="small"
              icon="send"
              label={<TextMorph>{emailCopied ? 'Email copied!' : 'send email'}</TextMorph>}
              onClick={(e) => {
                e.preventDefault();
                setHoveredType(null);
                handleEmailCopy();
              }}
            />
            <Button
              variant="primary"
              icon="next"
              label="see my work"
              to="/work"
              onClick={() => setHoveredType(null)}
            />
          </div>
        </RevealAnimation>
      </Container>
    </section>
  );
};

export default memo(HeroSection);
