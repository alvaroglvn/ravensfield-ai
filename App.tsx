import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, View } from "@tamagui/core";
import tamaguiConfig from "./tamagui.config";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="">
      <View></View>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
