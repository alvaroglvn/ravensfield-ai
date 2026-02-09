import { ScrollView, XStack, YStack, Text } from "tamagui";
import { useQuery } from "@tanstack/react-query";

import { ContentCard } from "@/components/ContentCard";

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

  return (
    <ScrollView paddingInline={20} paddingBlock={20}>
      {/* --- HERO SECTION --- */}
      <XStack
        gap="$3"
        width="100%"
        items="stretch"
        style={{
          alignSelf: "center",
          maxWidth: 1000,
        }}
      >
        {/* --- FEATURED POST --- */}
        <YStack flex={2}>
          <ContentCard
            isNew={true}
            slug={data[0].slug}
            imageUrl={data[0].artwork.imageUrl}
            type={data[0].artwork.type}
            title={data[0].title}
            seoDescription={data[0].seoDescription}
            flex={1}
          ></ContentCard>
        </YStack>
        {/* --- MOST RECENT --- */}
        <YStack flex={1.5} gap="$3">
          {data.slice(1).map((item: any) => (
            <ContentCard
              slug={item.slug}
              imageUrl={item.artwork.imageUrl}
              type={item.artwork.type}
              title={item.title}
              seoDescription={item.seoDescription}
              variant="compact"
            ></ContentCard>
          ))}
        </YStack>
      </XStack>
    </ScrollView>
  );
}
