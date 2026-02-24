import { styled, XStack, YStack, Text } from "tamagui";

const RibbonWrapper = styled(XStack, {
  pointerEvents: "none",
  position: "absolute",
  t: 40,
  l: 0,
  z: 10,
});

const RibbonBadge = styled(YStack, {
  paddingBlock: "$2",
  paddingInline: "$3",
  background: "$gray9",
});

const RibbonLabel = styled(Text, {
  color: "white",
  fontSize: "$2",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 1,
});

interface RibbonProps {
  label?: string;
}

export function Ribbon({ label = "New" }: RibbonProps) {
  return (
    <RibbonWrapper>
      <RibbonBadge>
        <RibbonLabel>{label}</RibbonLabel>
      </RibbonBadge>
    </RibbonWrapper>
  );
}
