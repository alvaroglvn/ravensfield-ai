import { YStack, XStack, Text, Theme } from "tamagui";
import { Link } from "expo-router";
import { useWindowDimensions } from "react-native";

import ThemeToggle from "@/components/ThemeToggle";
import HamburguerMenu from "@/components/HamburguerMenu";
import { Image } from "@/components/ExpoImage";
import { HeaderBar } from "@/styles/StyledHeader";
import { useTheme } from "@/context/ThemeContext";
import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  PADDING_MOBILE,
  PADDING_TABLET,
  PADDING_DESKTOP,
} from "@/styles/layout";
import logo from "assets/icon.svg";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  const { width } = useWindowDimensions();
  // Header uses <Theme name="inverse">, so its background is dark when the
  // resolved theme is "light". Invert the raster icon to keep it visible.
  const shouldInvert = resolvedTheme === "light";

  const isMobile = width < MOBILE_BREAKPOINT;
  const isTablet = width < TABLET_BREAKPOINT;
  const hPadding = isMobile ? PADDING_MOBILE : isTablet ? PADDING_TABLET : PADDING_DESKTOP;
  const vPadding = isMobile ? 16 : 30;
  const logoSize = isMobile ? 48 : 80;

  const logoEl = (
    <Link href="/">
      <YStack style={shouldInvert ? { filter: "invert(1)" } : undefined}>
        <Image src={logo} width={logoSize} height={logoSize} alt="Ravensfield logo" contentFit="contain" />
      </YStack>
    </Link>
  );

  const controlsEl = (
    <XStack gap="$2" items="center">
      <HamburguerMenu />
      <ThemeToggle />
    </XStack>
  );

  return (
    <Theme name="inverse">
      <HeaderBar paddingInline={hPadding} paddingBlock={vPadding}>
        {isMobile ? (
          <>
            <XStack flex={1} items="center">
              {logoEl}
            </XStack>
            {controlsEl}
          </>
        ) : (
          <>
            <YStack flex={1} items="flex-start">
              {logoEl}
            </YStack>

            <YStack flex={3} items="center">
              <Text
                fontFamily="$heading"
                numberOfLines={1}
                style={{ whiteSpace: "nowrap", fontSize: "clamp(14px, 3.8vw, 42px)" } as any}
              >
                {title}
              </Text>

              {subtitle && (
                <Text fontFamily="$body" fontSize="$4" fontStyle="italic">
                  {subtitle}
                </Text>
              )}
            </YStack>

            <YStack flex={1} items="flex-end">
              {controlsEl}
            </YStack>
          </>
        )}
      </HeaderBar>
    </Theme>
  );
}
