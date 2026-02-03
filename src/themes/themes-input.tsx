import { createV5Theme } from "@tamagui/themes/v5";

export const themes = createV5Theme({
  lightPalette: [
    "#F2F4F7", // 1:  App Background (Cool Gallery Wall)
    "#FFFFFF", // 2:  Card Background (Pure White)
    "#E6E8EB", // 3:  Subtle UI / Separators
    "#D7DADF", // 4:  Hover State
    "#C1C6CE", // 5:  Active / Pressed State
    "#9EA6B4", // 6:  Subtle Borders
    "#7C8594", // 7:  Strong Borders
    "#5E6878", // 8:  Disabled / Very Muted Text
    "#475060", // 9:  Secondary Text
    "#323946", // 10: Primary Text
    "#1F2430", // 11: High Contrast Text (Raven Tone)
    "#0D131F", // 12: Deepest Text (Midnight Wing)
  ],
  darkPalette: [
    "#05080F", // 1:  App Background (The Void)
    "#0D131F", // 2:  Card Background (Midnight Wing)
    "#151922", // 3:  Subtle UI
    "#1F2430", // 4:  Hover State
    "#2C3342", // 5:  Active State
    "#3D475C", // 6:  Subtle Borders
    "#505B70", // 7:  Strong Borders
    "#647085", // 8:  Disabled Text
    "#7E8C9F", // 9:  Secondary Text
    "#A0A8B8", // 10: Primary Text
    "#D1D5DB", // 11: High Contrast Text
    "#F0F2F5", // 12: Glowing Text
  ],
});
