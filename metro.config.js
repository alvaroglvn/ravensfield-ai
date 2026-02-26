const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");
const path = require("path"); // 1. Import path

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// 2. Add this block to force singletons
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.resolve(__dirname, "node_modules/react"),
  "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
  "@tamagui/core": path.resolve(__dirname, "node_modules/@tamagui/core"),
  tamagui: path.resolve(__dirname, "node_modules/tamagui"),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@libsql/client") {
    return context.resolveRequest(context, "@libsql/client/web", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./src/styles/tamagui.generated.css",
});
