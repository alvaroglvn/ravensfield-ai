const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

const config = getDefaultConfig(__dirname);

// Exclude native/server-only modules that don't work with Metro
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle all libsql and hrana related packages
  if (
    moduleName.startsWith("@libsql/") ||
    moduleName === "libsql" ||
    moduleName.startsWith("@hrana/") ||
    moduleName === "hrana-client"
  ) {
    return { type: "empty" };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./src/styles/tamagui.generated.css",
});
