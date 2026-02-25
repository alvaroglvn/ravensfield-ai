import { Suspense } from "react";
import { ScrollView, XStack, YStack, Text } from "tamagui";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ContentCard } from "@/components/ContentCard";
import { CompactCard } from "@/components/CompactCard";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { PADDING_MOBILE, PADDING_TABLET, PADDING_DESKTOP } from "@/styles/layout";
import { apiFetch } from "@/lib/fetch";

function HomeContent() {
  const { data } = useSuspenseQuery({
    queryKey: ["feedData"],
    queryFn: () => apiFetch<any[]>("/api/feed"),
  });

  const { isMobile, isTablet } = useBreakpoints();
  const hPadding = isMobile ? PADDING_MOBILE : isTablet ? PADDING_TABLET : PADDING_DESKTOP;

  if (data.length === 0) {
    return (
      <YStack
        flex={1}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Text>No articles found</Text>
      </YStack>
    );
  }

  const latestDiscoveries = (
    <YStack gap="$3">
      <YStack self="flex-start" paddingBlock="$2" paddingInline="$3" background="$gray9">
        <Text color="white" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>Latest Discoveries</Text>
      </YStack>
      {data.slice(1).map((item: any) => (
        <CompactCard
          key={item.slug}
          slug={item.slug}
          imageUrl={item.artwork.imageUrl}
          type={item.artwork.type}
          title={item.title}
        />
      ))}
    </YStack>
  );

  return (
    <ScrollView paddingInline={hPadding} paddingBlock={isMobile ? 24 : 48}>
      <YStack gap={isMobile ? 32 : 48}>
        {/* --- HERO SECTION --- */}
        {isTablet ? (
          // Mobile / narrow tablet: stack vertically
          <YStack gap="$3">
            <ContentCard
              isNew={true}
              slug={data[0].slug}
              imageUrl={data[0].artwork.imageUrl}
              type={data[0].artwork.type}
              title={data[0].title}
              seoDescription={data[0].seoDescription}
            />
            {latestDiscoveries}
          </YStack>
        ) : (
          // Tablet / desktop: side-by-side
          <XStack gap="$3" width="100%" items="stretch">
            <YStack flex={2}>
              <ContentCard
                isNew={true}
                slug={data[0].slug}
                imageUrl={data[0].artwork.imageUrl}
                type={data[0].artwork.type}
                title={data[0].title}
                seoDescription={data[0].seoDescription}
                flex={1}
              />
            </YStack>
            <YStack flex={1.5}>
              {latestDiscoveries}
            </YStack>
          </XStack>
        )}

        {/* --- CATEGORY CAROUSELS --- */}
        <CategoryCarousel category="painting" label="Painting" />
        <CategoryCarousel category="sculpture" label="Sculpture" />
        <CategoryCarousel category="drawing" label="Drawing" />
        <CategoryCarousel category="photography" label="Photography" />
        <CategoryCarousel category="objectdart" label="Objects d'Art" />
        <CategoryCarousel category="archaeological-finding" label="Archaeological Findings" />
      </YStack>
    </ScrollView>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <YStack flex={1} style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </YStack>
    }>
      <HomeContent />
    </Suspense>
  );
}
