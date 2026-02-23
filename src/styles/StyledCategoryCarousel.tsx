import { styled, YStack, XStack, Text } from "tamagui";

export const CarouselSection = styled(YStack, {
  gap: "$5",
});

export const CarouselHeader = styled(XStack, {
  justify: "space-between",
  items: "center",
});

export const SectionTitleBox = styled(YStack, {
  paddingBlock: "$2",
  paddingInline: "$3",
  bg: "$gray9",
  self: "flex-start",
});

export const SectionTitle = styled(Text, {
  color: "white",
  fontSize: "$3",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 1,
});

export const ViewAllButton = styled(YStack, {
  cursor: "pointer",
  hoverStyle: { opacity: 0.7 },
  pressStyle: { opacity: 0.5 },
});

export const ViewAllText = styled(Text, {
  fontSize: "$2",
  color: "$gray11",
  textTransform: "uppercase",
  letterSpacing: 2,
});

export const CarouselRow = styled(XStack, {
  gap: "$3",
});

// Outer shell: owns the shape, clipping, and aspect ratio
export const TileWrapper = styled(YStack, {
  flex: 1,
  aspectRatio: 1,
  overflow: "hidden",
  position: "relative",
  borderTopLeftRadius: "$6",
  borderTopRightRadius: "$2",
  borderBottomRightRadius: "$6",
  borderBottomLeftRadius: "$2",
});

// Inner pressable: fills the wrapper, handles article navigation
export const ImageTile = styled(YStack, {
  position: "absolute",
  t: 0,
  l: 0,
  r: 0,
  b: 0,
  cursor: "pointer",
  hoverStyle: { opacity: 0.88 },
  pressStyle: { scale: 0.97 },
  transition: "slow",
});

// Vertical strip button overlaid on the first / last tile
export const NavStrip = styled(YStack, {
  position: "absolute",
  t: 0,
  b: 0,
  width: 36,
  bg: "$gray9",
  items: "center",
  justify: "center",
  cursor: "pointer",
  z: 1,
  transition: "slow",
  hoverStyle: { bg: "$gray10" },
  pressStyle: { opacity: 0.75 },

  variants: {
    side: {
      left: { l: 0 },
      right: { r: 0 },
    },
  } as const,
});

export const NavArrow = styled(Text, {
  fontSize: "$4",
  color: "white",
  select: "none",
  lineHeight: 1,
});

export const ImageOverlay = styled(YStack, {
  position: "absolute",
  b: 0,
  l: 0,
  r: 0,
  p: "$3",
  gap: "$1",
});

export const TileType = styled(Text, {
  color: "$gray6",
  fontSize: "$1",
  textTransform: "uppercase",
  letterSpacing: 1,
});

export const TileTitle = styled(Text, {
  color: "white",
  fontSize: "$2",
  fontWeight: "500",
  lineHeight: "$2",
});
