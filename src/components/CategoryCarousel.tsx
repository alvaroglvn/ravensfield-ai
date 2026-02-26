import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { styled, ScrollView, XStack, YStack, Text } from "tamagui";

import { Image } from "@/components/ExpoImage";
import { PADDING_MOBILE, PADDING_TABLET } from "@/styles/layout";
import { apiFetch } from "@/lib/fetch";
import { useBreakpoints } from "@/hooks/useBreakpoints";

const CarouselSection = styled(YStack, {
  gap: "$5",
});

const CarouselHeader = styled(XStack, {
  justify: "space-between",
  items: "center",
});

const SectionTitleBox = styled(YStack, {
  paddingBlock: "$2",
  paddingInline: "$3",
  bg: "$gray9",
  self: "flex-start",
});

const SectionTitle = styled(Text, {
  color: "white",
  fontSize: "$3",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: 1,
});

const ViewAllButton = styled(YStack, {
  cursor: "pointer",
  hoverStyle: { opacity: 0.7 },
  pressStyle: { opacity: 0.5 },
});

const ViewAllText = styled(Text, {
  fontSize: "$2",
  color: "$gray11",
  textTransform: "uppercase",
  letterSpacing: 2,
});

const CarouselRow = styled(XStack, {
  gap: "$3",
});

// Outer shell: owns the shape, clipping, and aspect ratio
const TileWrapper = styled(YStack, {
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
const ImageTile = styled(YStack, {
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
const NavStrip = styled(YStack, {
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

const NavArrow = styled(Text, {
  fontSize: "$4",
  color: "white",
  select: "none",
  lineHeight: 1,
});


interface CarouselItem {
  slug: string;
  title: string;
  artwork: { imageUrl: string; type: string };
}


interface CategoryCarouselProps {
  category: string;
  label?: string;
}

export function CategoryCarousel({ category, label }: CategoryCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();
  const { width, isMobile, isTablet, isDesktop } = useBreakpoints();
  const isSmall = isTablet; // width < TABLET_BREAKPOINT
  const visibleCount = isDesktop ? 4 : 3;
  const pagePadding = isMobile ? PADDING_MOBILE * 2 : PADDING_TABLET * 2;

  const { data } = useQuery({
    queryKey: ["category", category],
    queryFn: () => apiFetch<CarouselItem[]>(`/api/category/${category}`),
  });

  if (!data || data.length === 0) return null;

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + visibleCount < data.length;
  const visibleItems = data.slice(startIndex, startIndex + visibleCount);

  const sectionLabel =
    label ?? category.charAt(0).toUpperCase() + category.slice(1);

  const header = (
    <CarouselHeader>
      <SectionTitleBox>
        <SectionTitle>{sectionLabel}</SectionTitle>
      </SectionTitleBox>
      <ViewAllButton onPress={() => router.push(`/category/${category}`)}>
        <ViewAllText>View All →</ViewAllText>
      </ViewAllButton>
    </CarouselHeader>
  );

  if (isSmall) {
    const tileSize = width - pagePadding;
    return (
      <CarouselSection>
        {header}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$3">
            {data.map((item) => (
              <YStack
                key={item.slug}
                width={tileSize}
                height={tileSize}
                style={{ flexShrink: 0 }}
                overflow="hidden"
                position="relative"
                borderTopLeftRadius="$6"
                borderTopRightRadius="$2"
                borderBottomRightRadius="$6"
                borderBottomLeftRadius="$2"
              >
                <ImageTile onPress={() => router.push(`/articles/${item.slug}`)}>
                  <Image
                    src={item.artwork.imageUrl}
                    alt={item.title}
                    width="100%"
                    height="100%"
                    contentFit="cover"
                    contentPosition="center"
                  />
                </ImageTile>
              </YStack>
            ))}
          </XStack>
        </ScrollView>
      </CarouselSection>
    );
  }

  return (
    <CarouselSection>
      {header}
      <CarouselRow>
        {visibleItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === visibleItems.length - 1;

          return (
            <TileWrapper key={item.slug}>
              <ImageTile onPress={() => router.push(`/articles/${item.slug}`)}>
                <Image
                  src={item.artwork.imageUrl}
                  alt={item.title}
                  width="100%"
                  height="100%"
                  contentFit="cover"
                  contentPosition="center"
                />
              </ImageTile>

              {isFirst && (
                <NavStrip
                  side="left"
                  opacity={canGoBack ? 1 : 0.25}
                  pointerEvents={canGoBack ? "auto" : "none"}
                  onPress={() => setStartIndex((i) => i - 1)}
                >
                  <NavArrow>←</NavArrow>
                </NavStrip>
              )}

              {isLast && (
                <NavStrip
                  side="right"
                  opacity={canGoForward ? 1 : 0.25}
                  pointerEvents={canGoForward ? "auto" : "none"}
                  onPress={() => setStartIndex((i) => i + 1)}
                >
                  <NavArrow>→</NavArrow>
                </NavStrip>
              )}
            </TileWrapper>
          );
        })}
      </CarouselRow>
    </CarouselSection>
  );
}
