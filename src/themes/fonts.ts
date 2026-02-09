import { createFont } from "tamagui";

// 1. THE RAVEN VOICE (Headings)
export const headingFont = createFont({
  family: "CormorantGaramond_700Bold",
  size: {
    1: 14,
    2: 18,
    3: 24,
    4: 30,
    5: 42,
    6: 64,
    7: 80,
    8: 96,
  },
  lineHeight: {
    1: 18,
    2: 24,
    3: 30,
    4: 40,
    5: 50,
    6: 74,
  },
  weight: {
    1: "400",
    2: "700",
  },
  letterSpacing: {
    1: 0,
    2: -1,
  },
  // NATIVE MAPPING: This ensures Android knows which file to use
  face: {
    400: { normal: "CormorantGaramond_400Regular" },
    700: { normal: "CormorantGaramond_700Bold" },
  },
});

// 2. THE ARCHIVE VOICE (Body)
export const bodyFont = createFont({
  family: "Inter_400Regular",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
  },
  weight: {
    1: "400",
    2: "600",
  },
  letterSpacing: {
    1: 0,
    2: 0,
  },
  face: {
    400: { normal: "Inter_400Regular" },
    600: { normal: "Inter_600SemiBold" },
  },
});
