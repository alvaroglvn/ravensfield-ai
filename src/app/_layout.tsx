import { TamaguiProvider, Theme, YStack } from "tamagui";
import { Slot, SplashScreen } from "expo-router"; // 1. Import SplashScreen
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";

import tamaguiConfig from "../../tamagui.config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { SITE_MAX_WIDTH } from "@/styles/layout";

// 3. Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

if (Platform.OS === "web") {
  require("@/styles/tamagui.generated.css");
}

function AppContent() {
  const { resolvedTheme, isLoaded: themeLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const appIsReady = themeLoaded && fontsLoaded;

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // On native, keep blocking render until ready (splash screen is visible).
  // On web, always render — SSR must not return null.
  if (!appIsReady && Platform.OS !== "web") {
    return null;
  }

  // Before mount: "light" matches the SSR render and the +html.tsx default,
  // preventing a Tamagui hydration mismatch. After mount, switch to the real theme.
  const activeTheme: "light" | "dark" = mounted ? resolvedTheme : "light";

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Theme name={activeTheme}>
        <YStack background="$color3" style={{ minHeight: "100dvh" }}>
          <YStack
            width="100%"
            maxW={SITE_MAX_WIDTH}
            self="center"
            flex={1}
            background="$background"
            boxShadow="0 0 60px rgba(0,0,0,0.18)"
          >
            <Header
              title="The Ravensfield Collection"
              subtitle="An AI Museum that Dreams of Itself"
            />
            <YStack flex={1}>
              <Slot />
            </YStack>
            <Footer />
          </YStack>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider defaultTheme="dark">
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
