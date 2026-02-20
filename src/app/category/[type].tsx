import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { H2, ScrollView, Spinner, Text, XStack, YStack } from "tamagui";

import { ContentCard } from "@/components/ContentCard";
import { CATEGORY_MAX_WIDTH } from "@/styles/layout";

async function fetchCategoryData(type: string) {
  const response = await fetch(`/api/category/${encodeURIComponent(type)}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
}

export default function CategoryPage() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categoryData", type],
    queryFn: () => fetchCategoryData(type),
    enabled: !!type,
  });

  if (isLoading) {
    return (
      <YStack flex={1} content="center" items="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} content="center" items="center">
        <Text>Error loading category: {(error as Error).message}</Text>
      </YStack>
    );
  }

  if (!data || data.length === 0) {
    return (
      <YStack flex={1} content="center" items="center">
        <Text>No artworks found in this category.</Text>
      </YStack>
    );
  }

  return (
    <ScrollView paddingInline="$5" paddingBlock="$5">
      <YStack maxW={CATEGORY_MAX_WIDTH} self="center" width="100%" gap="$5">
        <H2 textTransform="capitalize">
          {type === "objectdart"
            ? "object d'art"
            : type === "archaeological-finding"
              ? "archaeological finding"
              : type}
        </H2>
        <XStack flexWrap="wrap" gap="$4">
          {data.map((item: any) => (
            <ContentCard
              key={item.slug}
              flexBasis="31%"
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
