import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { YStack, Text, H1, Spinner, ScrollView } from "tamagui";

import { MuseumTag } from "src/components/MuseumTag";

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
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
        <Spinner size="large" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Error loading article: {(error as Error).message}</Text>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={true}>
      <YStack
        width="100%"
        backgroundColor="$background"
        padding="$15"
        alignItems="center"
      >
        <H1 fontSize="$8" marginBottom="$4">
          {data.title}
        </H1>
        <Image
          source={{ uri: data.artwork.imageUrl }}
          style={{ width: "100%", height: 700, alignSelf: "center" }}
          contentFit="contain"
        />
        <MuseumTag artwork={data.artwork} />

        <Text fontSize="$4" lineHeight="$6">
          {data.content}
        </Text>
      </YStack>
    </ScrollView>
  );
}
