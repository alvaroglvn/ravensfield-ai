import { styled, XStack, YStack, Text, Theme } from "tamagui";

const FooterBar = styled(XStack, {
  elevation: "$1",
  background: "$background",
  paddingBlock: 25,
  paddingInline: 25,
  justify: "space-between",
  items: "center",
});

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
