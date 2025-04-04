import { useEffect } from 'react';

const useThemeMotion = (isHovered, ref) => {
  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (isHovered && ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        animationFrameId = requestAnimationFrame(() => {
          ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
          ref.current.style.transition = 'transform 0.1s ease'; // Faster transition
        });
      } else if (ref?.current) {
        animationFrameId = requestAnimationFrame(() => {
          ref.current.style.transform = `translate(0, 0)`;
          ref.current.style.transition = 'transform 0.3s ease'; // Smooth return
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, ref]);
};

export default useThemeMotion;
