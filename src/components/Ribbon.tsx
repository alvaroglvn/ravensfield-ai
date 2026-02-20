import { Text, XStack, YStack } from "tamagui";

interface RibbonProps {
  label?: string;
}

export function Ribbon({ label = "New" }: RibbonProps) {
  return (
    <XStack
      pointerEvents="none"
      style={{ position: "absolute", top: 40, left: 0, zIndex: 10 }}
    >
      <YStack paddingBlock="$2" paddingInline="$3" background="$gray9">
        <Text
          color="white"
          fontSize="$2"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing={1}
        >
          {label}
        </Text>
      </YStack>
    </XStack>
  );
}
