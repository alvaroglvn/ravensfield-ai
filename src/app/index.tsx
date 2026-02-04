import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, XStack } from "tamagui";

import { ContentCard } from "../components/content-card/ContentCard";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView>
      {/* --- HERO SECTION --- */}
      <XStack>
        <ContentCard
          isNew={true}
          slug="test"
          imageUrl="https://cdn.leonardo.ai/users/1b5cfba4-58d0-4084-9594-f5e2c086b961/generations/a2da4bb7-b022-4a84-a33f-bfc1196e8373/Phoenix_Impressionist_still_life_painting_three_peaches_on_whi_0.jpg"
          type="Photograph"
          title="Example Title"
          seoDescription="Example description"
        ></ContentCard>
      </XStack>
    </ScrollView>
  );
}
