import { XStack, YStack, Text, Theme } from "tamagui";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Theme name="inverse">
      <XStack
        elevation="$1"
        background="$background"
        paddingBlock={25}
        paddingInline={25}
        justify="space-between"
        items="center"
      >
        <YStack />
        <YStack items="center">
          <Text fontSize="$2">© {year} Ravensfield AI</Text>
        </YStack>
        <YStack />
      </XStack>
    </Theme>
  );
}
