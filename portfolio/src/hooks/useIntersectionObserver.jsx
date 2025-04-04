// This is the core hook for detecting when an element enters the viewport. useScrollAnimation will typically use this internally.

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to observe intersection of a target element.
 *
 * @param {object} options - Intersection Observer options (root, rootMargin, threshold).
 * @param {boolean} triggerOnce - If true, stops observing after the first intersection.
 * @returns {[React.RefObject, boolean, IntersectionObserverEntry | null]} - Returns ref to attach, isIntersecting state, and the entry object.
 */
function useIntersectionObserver(options = {}, triggerOnce = false) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null); // Store the full entry object
  const targetRef = useRef(null); // Ref to attach to the target element

  useEffect(() => {
    const observerRefValue = targetRef.current; // Capture ref value for cleanup
    if (!observerRefValue) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentEntry = entries[0];
        if (currentEntry) {
          setEntry(currentEntry); // Update entry state
          setIsIntersecting(currentEntry.isIntersecting);

          // Disconnect if triggerOnce is true and element is intersecting
          if (triggerOnce && currentEntry.isIntersecting) {
            observer.unobserve(observerRefValue);
          }
        }
      },
      { ...options } // Spread the options object
    );

    observer.observe(observerRefValue);

    // Cleanup function
    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
      // Optional: disconnect fully if observer instance is not needed elsewhere
      // observer.disconnect();
    };
    // Re-run effect if options change or triggerOnce changes
    // Note: Stringifying options ensures changes in object values trigger effect
  }, [targetRef, JSON.stringify(options), triggerOnce]);

  return [targetRef, isIntersecting, entry];
}

export default useIntersectionObserver;

/*
// --- How to Use ---

import useIntersectionObserver from './useIntersectionObserver';

function AnimatedSection() {
  const options = { threshold: 0.3 }; // Trigger when 30% visible
  const [sectionRef, isVisible] = useIntersectionObserver(options, true); // Trigger only once

  return (
    <section
      ref={sectionRef}
      className={`my-section ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} // Add animation class when visible
    >
      <h2>My Animated Section</h2>
      <p>This content fades in when it becomes visible.</p>
    </section>
  );
}
*/
