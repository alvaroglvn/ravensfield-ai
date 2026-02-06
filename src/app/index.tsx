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
        style={{
          alignSelf: "center",
          maxWidth: 1000,
        }}
      >
        <YStack flex={2}>
          <ContentCard
            isNew={true}
            slug={data[0].slug}
            imageUrl={data[0].artwork.imageUrl}
            type={data[0].artwork.type}
            title={data[0].title}
            seoDescription={data[0].seoDescription}
          ></ContentCard>
        </YStack>
        <YStack
          flex={1}
          style={{
            justifyContent: "space-between",
          }}
        >
          <ContentCard
            variant="compact"
            slug="test"
            imageUrl="https://cdn.leonardo.ai/users/1b5cfba4-58d0-4084-9594-f5e2c086b961/generations/a2da4bb7-b022-4a84-a33f-bfc1196e8373/Phoenix_Impressionist_still_life_painting_three_peaches_on_whi_0.jpg"
            type="Photograph"
            title="Example Title"
            seoDescription="Example description"
          ></ContentCard>
          <ContentCard
            variant="compact"
            slug="test"
            imageUrl="https://cdn.leonardo.ai/users/1b5cfba4-58d0-4084-9594-f5e2c086b961/generations/a2da4bb7-b022-4a84-a33f-bfc1196e8373/Phoenix_Impressionist_still_life_painting_three_peaches_on_whi_0.jpg"
            type="Photograph"
            title="Example Title"
            seoDescription="Example description"
          ></ContentCard>
          <ContentCard
            variant="compact"
            slug="test"
            imageUrl="https://cdn.leonardo.ai/users/1b5cfba4-58d0-4084-9594-f5e2c086b961/generations/a2da4bb7-b022-4a84-a33f-bfc1196e8373/Phoenix_Impressionist_still_life_painting_three_peaches_on_whi_0.jpg"
            type="Photograph"
            title="Example Title"
            seoDescription="Example description"
          ></ContentCard>
          <ContentCard
            variant="compact"
            slug="test"
            imageUrl="https://cdn.leonardo.ai/users/1b5cfba4-58d0-4084-9594-f5e2c086b961/generations/a2da4bb7-b022-4a84-a33f-bfc1196e8373/Phoenix_Impressionist_still_life_painting_three_peaches_on_whi_0.jpg"
            type="Photograph"
            title="Example Title"
            seoDescription="Example description"
          ></ContentCard>
        </YStack>
      </XStack>
    </ScrollView>
  );
}
