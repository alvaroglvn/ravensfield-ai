import { styled, Card, YStack, Text } from "tamagui";

// 1. The Interactive Wrapper (Handles animations & cursor)
export const CardWrapper = styled(YStack, {
  position: "relative",
  cursor: "pointer",
  transition: "slow",
  scale: 1,
  hoverStyle: { scale: 1.01 },
  pressStyle: { scale: 0.98 },
});

// 2. The Card Frame (Handles borders, shadows, shape)
export const StyledCard = styled(Card, {
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "$background",
  elevation: 2,

  backfaceVisibility: "hidden",

  variants: {
    size: {
      default: {
        elevation: 5,
        minHeight: 560,
        borderTopLeftRadius: "$12",
        borderTopRightRadius: "$2",
        borderBottomRightRadius: "$12",
        borderBottomLeftRadius: "$2",
      },
      compact: {
        elevation: 2,
        height: 100,
        borderTopLeftRadius: "$6",
        borderTopRightRadius: "$2",
        borderBottomRightRadius: "$6",
        borderBottomLeftRadius: "$2",
      },
    },
  } as const,

  defaultVariants: {
    size: "default",
  },
});

// 3. Shared label for card type (used in ContentCard and CompactCard)
export const CardTypeLabel = styled(Text, {
  fontSize: "$2",
  color: "$gray11",
  textTransform: "uppercase",
});

export default StyledCard;
