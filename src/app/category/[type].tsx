import { Suspense } from "react";
import { useLocalSearchParams } from "expo-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollView, Spinner, Text, XStack, YStack } from "tamagui";

import { ContentCard } from "@/components/ContentCard";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import {
  CATEGORY_MAX_WIDTH,
  PADDING_MOBILE,
  PADDING_TABLET,
  PADDING_DESKTOP,
} from "@/styles/layout";
import { apiFetch } from "@/lib/fetch";

function CategoryContent() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { isMobile, isDesktop } = useBreakpoints();
  const hPadding = isMobile ? PADDING_MOBILE : isDesktop ? PADDING_DESKTOP : PADDING_TABLET;
  const cardBasis = isMobile ? "100%" : isDesktop ? "31%" : "48%";

  const { data } = useSuspenseQuery({
    queryKey: ["categoryData", type],
    queryFn: () => apiFetch<any[]>(`/api/category/${encodeURIComponent(type)}`),
  });

  if (data.length === 0) {
    return (
      <YStack flex={1} content="center" items="center">
        <Text>No artworks found in this category.</Text>
      </YStack>
    );
  }

  return (
    <ScrollView paddingInline={hPadding} paddingBlock="$5">
      <YStack maxW={CATEGORY_MAX_WIDTH} self="center" width="100%" gap="$4">
        <XStack flexWrap="wrap" gap="$4">
          {data.map((item: any) => (
            <ContentCard
              key={item.slug}
              flexBasis={cardBasis}
              slug={item.slug}
              imageUrl={item.artwork.imageUrl}
              type={item.artwork.type}
              title={item.title}
              seoDescription={item.seoDescription ?? ""}
            />
          ))}
        </XStack>
      </YStack>
    </ScrollView>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <YStack flex={1} content="center" items="center">
        <Spinner size="large" />
      </YStack>
    }>
      <CategoryContent />
    </Suspense>
  );
}
