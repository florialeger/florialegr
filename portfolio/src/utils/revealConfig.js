/**
 * Centralized configuration for reveal animations
 * All timing, easing, and animation parameters are defined here for easy management
 */

export const REVEAL_CONFIG = {
  // IntersectionObserver options
  viewport: {
    rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom of viewport
    threshold: 0.05, // Trigger when 5% of element is visible
  },

  // Animation timing (in milliseconds)
  timing: {
    stagger: 150, // Delay between sequential element animations
    duration: {
      opacity: 720,
      transform: 980,
      filter: 520,
    },
  },

  // Animation easing
  easing: 'cubic-bezier(0.33, 0.14, 0.27, 1)',

  // Initial state
  initial: {
    opacity: 0,
    translateY: '10px',
    blur: '2px',
  },

  // Final state
  final: {
    opacity: 1,
    translateY: '0',
    blur: '0',
  },

  // Behavior options
  behavior: {
    once: true, // Only animate once (don't re-trigger when scrolling back up)
    observeContainer: false, // If true, observes the container itself; if false, observes children
  },
};

/**
 * Helper to get stagger delay for a specific index
 * @param {number} index - The index of the element
 * @param {number} customStagger - Optional custom stagger value
 * @returns {number} - Delay in milliseconds
 */
export function getStaggerDelay(index, customStagger) {
  const stagger = customStagger ?? REVEAL_CONFIG.timing.stagger;
  return Math.max(0, index * stagger);
}

/**
 * Helper to build transition string
 * @returns {string} - CSS transition string
 */
export function getRevealTransition() {
  const { duration } = REVEAL_CONFIG.timing;
  const { easing } = REVEAL_CONFIG;
  return `
    filter ${duration.filter}ms ${easing},
    opacity ${duration.opacity}ms ${easing},
    transform ${duration.transform}ms ${easing}
  `.trim();
}
