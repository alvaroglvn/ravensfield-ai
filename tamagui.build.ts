import type { TamaguiBuildOptions } from "tamagui";

export default {
  config: "./tamagui.config.ts",
  components: ["tamagui"],
  outputCSS: "./src/styles/tamagui.generated.css",
} satisfies TamaguiBuildOptions;
