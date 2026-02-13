const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If anything tries to import the heavy native client...
  if (moduleName === "@libsql/client") {
    // ...redirect it to the lightweight web client!
    return context.resolveRequest(context, "@libsql/client/web", platform);
  }

  // Perform normal resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./src/styles/tamagui.generated.css",
});
