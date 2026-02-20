import { styled, YStack } from "tamagui";

import { MUSEUM_TAG_MAX_WIDTH } from "@/styles/layout";

export const MuseumTagContainer = styled(YStack, {
  borderWidth: 2,
  borderColor: "$gray8",
  paddingBlock: "$3",
  paddingInline: "$3",
  borderTopLeftRadius: "$10",
  borderTopRightRadius: "$2",
  borderBottomRightRadius: "$10",
  borderBottomLeftRadius: "$2",
  maxW: MUSEUM_TAG_MAX_WIDTH,
});
