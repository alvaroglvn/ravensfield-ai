import { defaultConfig } from "@tamagui/config/v5";
import { animations as animationsCSS } from "@tamagui/config/v5-css";
import { animations as animationsReanimated } from "@tamagui/config/v5-reanimated";
import { createTamagui, isWeb } from "tamagui";

import { themes } from "@/themes/themes";
import { headingFont, bodyFont } from "@/themes/fonts";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  disableSSR: false,
  fastSchemeChange: true,
  animations: isWeb ? animationsCSS : animationsReanimated,
  themes: {
    ...defaultConfig.themes,
    ...themes,
  },
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
