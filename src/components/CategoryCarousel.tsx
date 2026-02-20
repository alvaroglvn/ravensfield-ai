import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

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

const VISIBLE_COUNT = 4;

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
}

export function CategoryCarousel({ category }: CategoryCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["category", category],
    queryFn: () => fetchCategory(category),
  });

  if (isLoading || !data || data.length === 0) return null;

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + VISIBLE_COUNT < data.length;
  const visibleItems = data.slice(startIndex, startIndex + VISIBLE_COUNT);

  const sectionLabel =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <CarouselSection>
      <CarouselHeader>
        <SectionTitleBox>
          <SectionTitle>{sectionLabel}</SectionTitle>
        </SectionTitleBox>
        <ViewAllButton onPress={() => router.push(`/category/${category}`)}>
          <ViewAllText>View All →</ViewAllText>
        </ViewAllButton>
      </CarouselHeader>

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
