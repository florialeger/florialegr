import { useState, useEffect } from 'react';

export default function useReduced(breakpoint = 680) {
  const [isReduced, setIsReduced] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsReduced(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isReduced;
}
