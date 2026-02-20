import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { YStack, Text, Spinner, ScrollView } from "tamagui";

import { ARTWORK_IMAGE_MAX_WIDTH, ARTWORK_IMAGE_HEIGHT } from "@/styles/layout";

import { MuseumTag } from "@/components/MuseumTag";
import { Image } from "@/components/ExpoImage";
import { Article } from "@/components/Article";

// --- Fetch data from article API ---
async function fetchArticleData(slug: string) {
  const response = await fetch(`/api/article/${slug}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function ArticlePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["articleData", slug],
    queryFn: () => fetchArticleData(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <YStack flex={1} content="center" items="center">
        <Text>Loading...</Text>
        <Spinner size="large" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} content="center" items="center">
        <Text>Error loading article: {(error as Error).message}</Text>
      </YStack>
    );
  }

  return (
    <ScrollView
      flex={1}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBlockEnd: 100 }} // Make sure scroll doesn't cut off content
    >
      {/* --- ARTWORK HEADER --- */}
      <YStack gap="$4" marginBlock="$10" items={"center"}>
        <Image
          src={data.artwork.imageUrl}
          contentFit="contain"
          width="100%"
          maxWidth={ARTWORK_IMAGE_MAX_WIDTH}
          height={ARTWORK_IMAGE_HEIGHT}
        />
        <MuseumTag artwork={data.artwork} />
      </YStack>

      {/* ---- STORY CONTENT --- */}
      <Article
        title={data.title}
        content={data.content}
        quotes={data.quotes ?? []}
      />
    </ScrollView>
  );
}
