import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768; // Tailwind's md breakpoint

interface UseIsMobileOptions {
  onDesktop?: () => void;
}

export function useIsMobile(options?: UseIsMobileOptions): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // SSR-safe initial value
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      
      // Call onDesktop callback when switching from mobile to desktop
      if (!e.matches && options?.onDesktop) {
        options.onDesktop();
      }
    };

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [options]);

  return isMobile;
}