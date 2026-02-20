import { YStack, Text, Theme } from "tamagui";

import { FooterBar } from "@/styles/StyledFooter";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Theme name="inverse">
      <FooterBar>
        <YStack />
        <YStack items="center">
          <Text fontSize="$2">© {year} Ravensfield AI</Text>
        </YStack>
        <YStack />
      </FooterBar>
    </Theme>
  );
}
