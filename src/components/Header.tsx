import { YStack, XStack, H1, H2, Theme } from "tamagui";

import HamburguerMenu from "@/components/HamburguerMenu";
import ThemeToggle from "@/components/ThemeToggle";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({
  title = "Ravensfield AI",
  subtitle = "An AI Museum",
}: HeaderProps) {
  return (
    <Theme name="inverse">
      <XStack
        elevation={"$1"}
        background="$background"
        style={{
          padding: 25,
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <YStack>
          <ThemeToggle />
        </YStack>
        <YStack style={{ alignItems: "center" }}>
          <H1>{title}</H1>
          {subtitle && <H2>{subtitle}</H2>}
        </YStack>
        <YStack>
          <HamburguerMenu />
        </YStack>
      </XStack>
    </Theme>
  );
}
