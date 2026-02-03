import { defaultConfig } from "@tamagui/config/v5";
import { animations as animationsCSS } from "@tamagui/config/v5-css";
import { animations as animationsReanimated } from "@tamagui/config/v5-reanimated";
import { createTamagui, isWeb } from "tamagui";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  disableSSR: false,
  fastSchemeChange: true,
  animations: isWeb ? animationsCSS : animationsReanimated,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
