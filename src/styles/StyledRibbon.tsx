import { styled, XStack, YStack, Text } from "tamagui";

export const RibbonWrapper = styled(XStack, {
  pointerEvents: "none",
  position: "absolute",
  t: 40,
  l: 0,
  z: 10,
});

export const RibbonBadge = styled(YStack, {
  paddingBlock: "$2",
  paddingInline: "$3",
  background: "$gray9",
});

export const RibbonLabel = styled(Text, {
  color: "white",
  fontSize: "$2",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 1,
});
