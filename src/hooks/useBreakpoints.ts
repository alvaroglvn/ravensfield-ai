import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  DESKTOP_BREAKPOINT,
} from "@/styles/layout";

export function useBreakpoints() {
  const [mounted, setMounted] = useState(false);
  const { width: rawWidth } = useWindowDimensions();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, use 0 so the server render and the initial client
  // render produce identical output, avoiding React hydration mismatches.
  const width = mounted ? rawWidth : 0;

  return {
    width,
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width < TABLET_BREAKPOINT,
    isDesktop: width >= DESKTOP_BREAKPOINT,
  };
}
