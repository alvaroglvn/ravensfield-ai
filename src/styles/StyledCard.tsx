import { GetProps, View, styled } from "tamagui";

export const StyledCard = styled(View, {
  name: "StyledCard",
  position: "relative",
  width: "100%",
  maxW: "75%",
  aspectRatio: 4 / 3,
  borderWidth: 5,
  borderColor: "$borderColor",
  borderTopLeftRadius: "$2",
  borderTopRightRadius: "$7",
  borderBottomRightRadius: "$2",
  borderBottomLeftRadius: "$7",
  overflow: "hidden",
});

export type StyledCardProps = GetProps<typeof StyledCard>;
