import { YStack, Text, Theme } from "tamagui";
import { Link } from "expo-router";

import ThemeToggle from "@/components/ThemeToggle";
import { Image } from "@/components/ExpoImage";
import { HeaderBar } from "@/styles/StyledHeader";
import { useTheme } from "@/context/ThemeContext";
import logo from "assets/icon.svg";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  // Header uses <Theme name="inverse">, so its background is dark when the
  // resolved theme is "light". Invert the raster icon to keep it visible.
  const shouldInvert = resolvedTheme === "light";

  return (
    <Theme name="inverse">
      <HeaderBar>
        <YStack flex={1} items="flex-start">
          <Link href="/">
            <YStack style={shouldInvert ? { filter: "invert(1)" } : undefined}>
              <Image src={logo} width={80} height={80} alt="Ravensfield logo" contentFit="contain" />
            </YStack>
          </Link>
        </YStack>

        <YStack flex={3} items="center">
          <Text fontFamily="$heading" fontSize="$5">
            {title}
          </Text>

          {subtitle && (
            <Text fontFamily="$body" fontSize="$4" fontStyle="italic">
              {subtitle}
            </Text>
          )}
        </YStack>

        <YStack flex={1} items="flex-end">
          <ThemeToggle />
          {/* <HamburguerMenu /> */}
        </YStack>
      </HeaderBar>
    </Theme>
  );
}
