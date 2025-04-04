import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Sign1, Sign2, Sign3 } from '@/assets/svgs/IconAnimation';
import styles from './SiteEntryAnimation.module.css';

const SiteEntryAnimation = ({ onFinished }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const signs = containerRef.current?.querySelectorAll(`.${styles.pathSvg}`);
    if (!signs || signs.length === 0) {
      console.warn('SiteEntryAnimation: SVG paths not found.');
      const fallbackTimeout = setTimeout(() => {
        if (typeof onFinished === 'function') {
          onFinished();
        }
      }, 100);
      return () => clearTimeout(fallbackTimeout);
    }

    const animationDurations = [1.0, 1.6, 0.2];
    const delayBetweenSigns = 100;
    let currentSign = 0;

    function animateSign() {
      if (currentSign < signs.length) {
        const path = signs[currentSign]?.querySelector('path');

        if (path && typeof path.getTotalLength === 'function') {
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length} ${length}`;
          path.style.strokeDashoffset = length;
          path.style.animation = `${styles.dashAnimation} ${animationDurations[currentSign]}s ease-in-out forwards`;

          const animationEndHandler = () => {
            currentSign++;
            setTimeout(animateSign, delayBetweenSigns);
          };

          path.addEventListener('animationend', animationEndHandler, {
            once: true,
          });

          return () => {
            path.removeEventListener('animationend', animationEndHandler);
          };
        } else {
          console.warn(
            `SiteEntryAnimation: Path or getTotalLength not found for sign index ${currentSign}`
          );
          currentSign++;
          setTimeout(animateSign, delayBetweenSigns);
        }
      } else {
        const finishTimeout = setTimeout(() => {
          if (typeof onFinished === 'function') {
            onFinished();
          }
        }, 800);
        return () => clearTimeout(finishTimeout);
      }
    }

    const cleanupAnimation = animateSign();

    return cleanupAnimation;
  }, [onFinished]);

  return (
    <div
      ref={containerRef}
      className={styles.svgContainer}
      aria-label="Loading..."
      role="status"
    >
      <Sign1 />
      <Sign2 />
      <Sign3 />
    </div>
  );
};

SiteEntryAnimation.propTypes = {
  onFinished: PropTypes.func.isRequired,
};

export default SiteEntryAnimation;
