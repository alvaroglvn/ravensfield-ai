import { styled, XStack } from "tamagui";

export const HeaderBar = styled(XStack, {
  background: "$background",
  width: "100%",
  items: "center",
  // paddingBlock and paddingInline are supplied as props from Header.tsx
});
