import { TamaguiProvider } from "@tamagui/core";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import tamaguiConfig from "../../tamagui.config";
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Header title="The Ravensfield Collection" />
      <Slot />
    </TamaguiProvider>
  );
}
