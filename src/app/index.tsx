import { ScrollView, XStack, YStack } from "tamagui";

import { ContentCard } from "@/components/ContentCard";
import { X } from "@tamagui/lucide-icons";

export default function Home() {
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
            slug="test"
            imageUrl="https://cdn.leonardo.ai/users/1b5cfba4-58d0-4084-9594-f5e2c086b961/generations/a2da4bb7-b022-4a84-a33f-bfc1196e8373/Phoenix_Impressionist_still_life_painting_three_peaches_on_whi_0.jpg"
            type="Photograph"
            title="Example Title"
            seoDescription="Example description"
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
