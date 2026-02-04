import { YStack, XStack, H1, H2, Text } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";

import HamburguerMenu from "./HamburguerMenu";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({
  title = "Ravensfield AI",
  subtitle = "An AI Museum",
}: HeaderProps) {
  return (
    <SafeAreaView>
      <XStack
        elevation={"$1"}
        style={{
          padding: 25,
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <YStack>
          <Text>Placeholder</Text>
        </YStack>
        <YStack style={{ alignItems: "center" }}>
          <H1>{title}</H1>
          {subtitle && <H2>{subtitle}</H2>}
        </YStack>
        <YStack>
          <HamburguerMenu />
        </YStack>
      </XStack>
    </SafeAreaView>
  );
}
