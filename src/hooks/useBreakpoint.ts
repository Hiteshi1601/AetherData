import { useState, useEffect } from 'react';

/**
 * Custom hook to detect window size and check if it matches the mobile breakpoint.
 * Uses requestAnimationFrame to throttle resize events for optimal performance.
 */
export function useBreakpoint(widthThreshold = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < widthThreshold;
    }
    return false;
  });

  useEffect(() => {
    let frameId: number;
    
    const handleResize = () => {
      // Throttle state changes with requestAnimationFrame to avoid forced synchronous layouts
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const currentIsMobile = window.innerWidth < widthThreshold;
        setIsMobile((prev) => (prev !== currentIsMobile ? currentIsMobile : prev));
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [widthThreshold]);

  return isMobile;
}
