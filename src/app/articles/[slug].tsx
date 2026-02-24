import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { YStack, Text, Spinner, ScrollView } from "tamagui";

import {
  ARTWORK_IMAGE_MAX_WIDTH,
  ARTWORK_IMAGE_HEIGHT,
  PADDING_MOBILE,
  PADDING_TABLET,
  PADDING_DESKTOP,
} from "@/styles/layout";
import { useBreakpoints } from "@/hooks/useBreakpoints";

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
  const { isMobile, isDesktop } = useBreakpoints();
  const hPadding = isMobile ? PADDING_MOBILE : isDesktop ? PADDING_DESKTOP : PADDING_TABLET;

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
      paddingInline={hPadding}
      contentContainerStyle={{ paddingBlockEnd: 100 }} // Make sure scroll doesn't cut off content
    >
      {/* --- ARTWORK HEADER --- */}
      <YStack gap={isMobile ? "$3" : "$4"} marginBlockStart={isMobile ? "$6" : "$10"} marginBlockEnd={isMobile ? "$4" : "$10"} items={"center"}>
        <Image
          src={data.artwork.imageUrl}
          contentFit="contain"
          width="100%"
          maxWidth={ARTWORK_IMAGE_MAX_WIDTH}
          height={isMobile ? 300 : ARTWORK_IMAGE_HEIGHT}
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
