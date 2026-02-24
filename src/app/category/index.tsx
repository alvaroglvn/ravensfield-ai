import { useWindowDimensions } from "react-native";
import { ScrollView, YStack } from "tamagui";

import { CategoryCarousel } from "@/components/CategoryCarousel";
import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  PADDING_MOBILE,
  PADDING_TABLET,
  PADDING_DESKTOP,
} from "@/styles/layout";

export default function CategoriesPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  const isNarrow = width < TABLET_BREAKPOINT;
  const hPadding = isMobile ? PADDING_MOBILE : isNarrow ? PADDING_TABLET : PADDING_DESKTOP;

  return (
    <ScrollView paddingInline={hPadding} paddingBlock={isMobile ? 24 : 48}>
      <YStack gap={isMobile ? 32 : 48}>
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
