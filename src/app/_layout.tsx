import { useEffect } from "react";
import { TamaguiProvider, YStack, XStack } from "tamagui";
import { Slot, SplashScreen } from "expo-router";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import tamaguiConfig from "../../tamagui.config";
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={"light"}>
        <Header title="The Ravensfield Collection" />
        <Slot />
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
