import { TamaguiProvider, Theme, YStack } from "tamagui";
import { Slot } from "expo-router";
import { Platform } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import tamaguiConfig from "../../tamagui.config";
import Header from "../components/Header";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

// Import generated CSS for web theme switching
if (Platform.OS === "web") {
  require("../styles/tamagui.generated.css");
}

function AppContent() {
  const { resolvedTheme } = useTheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={resolvedTheme}>
      <Theme name={resolvedTheme}>
        <YStack flex={1} background="$background">
          <Header title="The Ravensfield Collection" />
          <Slot />
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider defaultTheme="system">
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
