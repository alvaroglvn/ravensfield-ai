import { YStack, Text, Theme } from "tamagui";
import { Link } from "expo-router";

import ThemeToggle from "@/components/ThemeToggle";
import { Image } from "@/components/ExpoImage";
import { HeaderBar } from "@/styles/StyledHeader";
import logo from "@/logos/ravensfield-logo.webp";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <Theme name="inverse">
      <HeaderBar>
        <YStack flex={1} items="flex-start">
          <Link href="/">
            <Image src={logo} width={80} height={80} alt="Ravensfield logo" />
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
