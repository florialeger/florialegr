// You might not strictly need this if useIntersectionObserver is sufficient.
//  This hook would be a convenience wrapper around useIntersectionObserver specifically focused on adding/removing CSS classes.

import { useEffect } from 'react';
import useIntersectionObserver from './useIntersectionObserver'; // Reuse the core hook

/**
 * Custom hook to apply animation classes based on element visibility using Intersection Observer.
 *
 * @param {object} observerOptions - Intersection Observer options.
 * @param {string} animationClass - The CSS class to add when intersecting.
 * @param {string} initialClass - Optional CSS class(es) to apply initially (e.g., 'opacity-0').
 * @param {boolean} triggerOnce - If true, animation class is never removed after first intersection.
 * @returns {React.RefObject} - Ref to attach to the target element.
 */
function useScrollAnimation(
    observerOptions = { threshold: 0.1 },
    animationClass = 'animate-on-scroll', // Example animation class
    initialClass = 'opacity-0', // Example initial state
    triggerOnce = true
) {
    const [targetRef, isIntersecting] = useIntersectionObserver(observerOptions, triggerOnce);

    useEffect(() => {
        const element = targetRef.current;
        if (!element) return;

        // Set initial class(es)
        if (initialClass) {
             const classes = initialClass.split(' ').filter(Boolean);
             element.classList.add(...classes);
        }

        // Handle adding/removing animation class
        if (isIntersecting) {
            if (initialClass) {
                const classes = initialClass.split(' ').filter(Boolean);
                element.classList.remove(...classes); // Remove initial state class
            }
            element.classList.add(animationClass);
        } else if (!triggerOnce) {
            // Only remove if not triggerOnce
            element.classList.remove(animationClass);
             if (initialClass) {
                const classes = initialClass.split(' ').filter(Boolean);
                element.classList.add(...classes); // Re-add initial state class if element scrolls out
            }
        }

    }, [isIntersecting, targetRef, animationClass, initialClass, triggerOnce]);

    return targetRef; // Return only the ref for easy attachment
}

export default useScrollAnimation;

/*
// --- How to Use ---
import useScrollAnimation from './useScrollAnimation';

function MyComponent() {
  // Define animation classes in your CSS:
  // .fade-in-up { animation: fadeInUp 0.5s forwards; }
  // .opacity-0 { opacity: 0; }

  const sectionRef = useScrollAnimation(
      { threshold: 0.2 }, // Options
      'fade-in-up',       // Animation class
      'opacity-0',        // Initial class
      true                // Trigger once
  );

  return (
    <div ref={sectionRef} style={{ minHeight: '300px', border: '1px solid red' }}>
      Content to animate
    </div>
  );
}
*/