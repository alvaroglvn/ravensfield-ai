import { TamaguiProvider } from "@tamagui/core";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import tamaguiConfig from "../../tamagui.config";

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="">
      <Slot />
    </TamaguiProvider>
  );
}
