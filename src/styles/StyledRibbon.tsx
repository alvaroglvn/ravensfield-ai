import { styled, XStack, YStack, Text } from "tamagui";

export const RibbonWrapper = styled(XStack, {
  pointerEvents: "none",
  position: "absolute",
  top: 40,
  left: 0,
  zIndex: 10,
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
