import { useEffect, useRef } from 'react';

/**
 * useRevealOnView
 * Observes child items inside a container and adds the 'is-visible' class when they enter the viewport.
 * Supports optional staggered delays and a separate target selector to avoid applying classes on the outer node.
 *
 * containerRef: React ref to a DOM node
 * options: { itemSelector, targetSelector, rootMargin, threshold, stagger, once }
 */
export default function useRevealOnView(containerRef, options = {}) {
  const opts = Object.assign(
    {
      itemSelector: null, // if null, observe the container itself
      targetSelector: null, // if set, add classes/styles to this selector relative to the item
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05,
      stagger: 80,
      once: true,
    },
    options
  );

  const timersRef = useRef(new Map());
  const observerRef = useRef(null);

  useEffect(() => {
    const timers = timersRef.current;
    const container = containerRef?.current;
    if (!container) return undefined;

    const getItems = () => {
      if (!opts.itemSelector) return [container];
      return Array.from(container.querySelectorAll(opts.itemSelector));
    };

    const items = getItems();
    if (!items.length) return undefined;

    const onIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          const idx = items.indexOf(el);
          const delay = Math.max(0, (idx >= 0 ? idx : 0) * opts.stagger);

          const target = opts.targetSelector ? el.querySelector(opts.targetSelector) : el;
          if (!target) return;

          // schedule adding class with stagger
          const id = window.setTimeout(() => {
            // set small rAF to avoid layout thrash
            requestAnimationFrame(() => {
              target.classList.add('is-visible');
              // clear inline transition-delay if previously set
              if (delay) target.style.transitionDelay = `${delay}ms`;
            });
          }, delay);
          timersRef.current.set(el, id);

          if (opts.once) {
            observer.unobserve(el);
          }
        } else if (!opts.once) {
          // remove class when leaving
          const target = opts.targetSelector ? el.querySelector(opts.targetSelector) : el;
          if (!target) return;
          // clear pending timer
          const t = timersRef.current.get(el);
          if (t) {
            clearTimeout(t);
            timersRef.current.delete(el);
          }
          requestAnimationFrame(() => target.classList.remove('is-visible'));
        }
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: opts.rootMargin,
      threshold: opts.threshold,
    });

    observerRef.current = observer;

    items.forEach((it) => observer.observe(it));

    return () => {
      observer.disconnect();
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
    };
  }, [containerRef, opts.itemSelector, opts.targetSelector, opts.rootMargin, opts.threshold, opts.stagger, opts.once]);
}
