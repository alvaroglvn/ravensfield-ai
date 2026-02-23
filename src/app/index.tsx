import { ScrollView, XStack, YStack, Text } from "tamagui";
import { useQuery } from "@tanstack/react-query";
import { useWindowDimensions } from "react-native";

import { ContentCard } from "@/components/ContentCard";
import { CompactCard } from "@/components/CompactCard";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  PADDING_MOBILE,
  PADDING_TABLET,
  PADDING_DESKTOP,
} from "@/styles/layout";

// --- Fetch data from feed API ---
async function fetchFeedData() {
  const response = await fetch("/api/feed");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["feedData"],
    queryFn: fetchFeedData,
  });

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  const isNarrow = width < TABLET_BREAKPOINT;
  const hPadding = isMobile ? PADDING_MOBILE : isNarrow ? PADDING_TABLET : PADDING_DESKTOP;

  if (isLoading) {
    return (
      <YStack
        flex={1}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Text>Loading...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1}>
        <Text>Error loading data: {(error as Error).message}</Text>
      </YStack>
    );
  }

  if (!data || data.length === 0) {
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
        {isNarrow ? (
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
        <CategoryCarousel category="painting" />
        <CategoryCarousel category="sculpture" />
        <CategoryCarousel category="drawing" />
        <CategoryCarousel category="photography" />
        <CategoryCarousel category="objectdart" label="Object d'Art" />
        <CategoryCarousel category="archaeological-finding" label="Archaeological Finding" />
      </YStack>
    </ScrollView>
  );
}
