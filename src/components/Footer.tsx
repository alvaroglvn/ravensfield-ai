import { XStack, YStack, Text, Theme } from "tamagui";

export default function Footer() {
  const year = new Date().getFullYear();

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
        <YStack />
        <YStack style={{ alignItems: "center" }}>
          <Text size="$2">© {year} Ravensfield AI</Text>
        </YStack>
        <YStack />
      </XStack>
    </Theme>
  );
}
