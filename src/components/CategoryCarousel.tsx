import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ScrollView, XStack, YStack } from "tamagui";

import { Image } from "@/components/ExpoImage";
import {
  CarouselSection,
  CarouselHeader,
  CarouselRow,
  SectionTitleBox,
  SectionTitle,
  ViewAllButton,
  ViewAllText,
  TileWrapper,
  ImageTile,
  NavStrip,
  NavArrow,
} from "@/styles/StyledCategoryCarousel";
import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  DESKTOP_BREAKPOINT,
  PADDING_MOBILE,
  PADDING_TABLET,
} from "@/styles/layout";

interface CarouselItem {
  slug: string;
  title: string;
  artwork: { imageUrl: string; type: string };
}

async function fetchCategory(category: string): Promise<CarouselItem[]> {
  const res = await fetch(`/api/category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

interface CategoryCarouselProps {
  category: string;
  label?: string;
}

export function CategoryCarousel({ category, label }: CategoryCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < TABLET_BREAKPOINT;
  const visibleCount = width >= DESKTOP_BREAKPOINT ? 4 : 3;
  const pagePadding = width < MOBILE_BREAKPOINT ? PADDING_MOBILE * 2 : PADDING_TABLET * 2;

  const { data, isLoading } = useQuery({
    queryKey: ["category", category],
    queryFn: () => fetchCategory(category),
  });

  if (isLoading || !data || data.length === 0) return null;

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
