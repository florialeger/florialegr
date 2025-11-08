import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_OPTIONS = {
  maxDistance: 18,
  easing: 0.2,
  scale: 1.04,
  restScale: 1,
  pointerType: 'fine',
  applyOnCoarse: false,
};

const isReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isPointerType = (type) => typeof window !== 'undefined' && window.matchMedia(`(pointer: ${type})`).matches;

function useMagneticEffect(options = {}) {
  const [element, setElement] = useState(null);
  const frameRef = useRef(null);
  const baseTransformRef = useRef('');
  const currentRef = useRef({ x: 0, y: 0, scale: DEFAULT_OPTIONS.restScale });
  const targetRef = useRef({ x: 0, y: 0, scale: DEFAULT_OPTIONS.restScale });

  const {
    maxDistance = DEFAULT_OPTIONS.maxDistance,
    easing = DEFAULT_OPTIONS.easing,
    scale = DEFAULT_OPTIONS.scale,
    restScale = DEFAULT_OPTIONS.restScale,
    pointerType = DEFAULT_OPTIONS.pointerType,
    applyOnCoarse = DEFAULT_OPTIONS.applyOnCoarse,
  } = options;

  const cleanupFrame = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const animate = useCallback(
    (node) => {
      cleanupFrame();

      frameRef.current = requestAnimationFrame(() => {
        if (!node) {
          return;
        }

        const current = currentRef.current;
        const target = targetRef.current;

        current.x += (target.x - current.x) * easing;
        current.y += (target.y - current.y) * easing;
        current.scale += (target.scale - current.scale) * easing;

        const diffX = Math.abs(target.x - current.x);
        const diffY = Math.abs(target.y - current.y);
        const diffScale = Math.abs(target.scale - current.scale);

        if (diffX < 0.01 && diffY < 0.01 && diffScale < 0.001) {
          currentRef.current = { ...target };
        }

        const transform = `${baseTransformRef.current} translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(
          2
        )}px, 0) scale(${current.scale.toFixed(4)})`.trim();

        node.style.transform = transform;

        if (diffX >= 0.01 || diffY >= 0.01 || diffScale >= 0.001) {
          animate(node);
        } else {
          cleanupFrame();
        }
      });
    },
    [cleanupFrame, easing]
  );

  const setTarget = useCallback(
    (node, x, y, nextScale) => {
      if (!node) {
        return;
      }

      targetRef.current = { x, y, scale: nextScale };
      animate(node);
    },
    [animate]
  );

  useEffect(() => {
    const node = element;
    if (!node) {
      return undefined;
    }

    if (isReducedMotion()) {
      return undefined;
    }

    if (!applyOnCoarse && pointerType && !isPointerType(pointerType)) {
      return undefined;
    }

    const rect = node.getBoundingClientRect();
    baseTransformRef.current = window.getComputedStyle(node).transform.replace('none', '');
    currentRef.current = { x: 0, y: 0, scale: restScale };
    targetRef.current = { x: 0, y: 0, scale: restScale };

    const handlePointerMove = (event) => {
      const bounds = node.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

      const offsetX = Math.max(Math.min(relativeX * 2 * maxDistance, maxDistance), -maxDistance);
      const offsetY = Math.max(Math.min(relativeY * 2 * maxDistance, maxDistance), -maxDistance);

      setTarget(node, offsetX, offsetY, scale);
    };

    const handlePointerLeave = () => {
      setTarget(node, 0, 0, restScale);
    };

    const handlePointerEnter = () => {
      // Refresh rect so that large layout changes don't break the effect
      Object.assign(rect, node.getBoundingClientRect());
    };

    node.style.willChange = 'transform';
    node.addEventListener('pointermove', handlePointerMove, { passive: true });
    node.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    node.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    return () => {
      cleanupFrame();
      setTarget(node, 0, 0, restScale);
      node.style.willChange = '';
      node.style.transform = baseTransformRef.current || '';
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
      node.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [element, maxDistance, easing, scale, restScale, pointerType, applyOnCoarse, cleanupFrame, setTarget]);

  const setNode = useCallback((node) => {
    setElement(node || null);
  }, []);

  return setNode;
}

export default useMagneticEffect;
