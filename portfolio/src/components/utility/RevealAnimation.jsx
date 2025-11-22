import { keyframes } from '@emotion/react';
import { Reveal } from 'react-awesome-reveal';
import { REVEAL_CONFIG } from '@/utils/revealConfig';

// Custom animation based on project's reveal configuration
const customReveal = keyframes`
  from {
    opacity: ${REVEAL_CONFIG.initial.opacity};
    transform: translateY(${REVEAL_CONFIG.initial.translateY});
    filter: blur(${REVEAL_CONFIG.initial.blur});
  }

  to {
    opacity: ${REVEAL_CONFIG.final.opacity};
    transform: translateY(${REVEAL_CONFIG.final.translateY});
    filter: blur(${REVEAL_CONFIG.final.blur});
  }
`;

/**
 * RevealAnimation Component
 *
 * A wrapper around react-awesome-reveal with custom animation parameters
 * from the project's reveal configuration.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elements to animate
 * @param {number} [props.delay] - Delay before animation starts (ms)
 * @param {number} [props.duration] - Animation duration (ms)
 * @param {boolean} [props.cascade] - Whether to animate children sequentially
 * @param {number} [props.damping] - Delay multiplier for cascade (0-1, lower = faster)
 * @param {boolean} [props.triggerOnce] - Whether to trigger only once
 * @param {string} [props.fraction] - Fraction of element visible before trigger (0-1)
 */
export function RevealAnimation({
  children,
  delay = 0,
  duration = REVEAL_CONFIG.timing.duration.opacity,
  cascade = false,
  damping = 0.15,
  triggerOnce = REVEAL_CONFIG.behavior.once,
  fraction = REVEAL_CONFIG.viewport.threshold,
  ...props
}) {
  return (
    <Reveal
      keyframes={customReveal}
      delay={delay}
      duration={duration}
      cascade={cascade}
      damping={damping}
      triggerOnce={triggerOnce}
      fraction={fraction}
      {...props}
    >
      {children}
    </Reveal>
  );
}

export default RevealAnimation;
