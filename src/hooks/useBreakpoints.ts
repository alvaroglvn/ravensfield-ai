import { useWindowDimensions } from "react-native";

import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  DESKTOP_BREAKPOINT,
} from "@/styles/layout";

export function useBreakpoints() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width < TABLET_BREAKPOINT,
    isDesktop: width >= DESKTOP_BREAKPOINT,
  };
}
