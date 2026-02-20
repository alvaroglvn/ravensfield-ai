import { XStack, SizableText, YStack, Separator } from "tamagui";

type Artwork = {
  title?: string | null;
  year?: string | number | null;
  medium?: string | null;
  artist?: string | null;
};

export function MuseumTag({ artwork }: { artwork?: Artwork | null }) {
  if (!artwork) return null;

  return (
    <YStack
      borderWidth={2}
      borderColor="$gray8"
      paddingBlock="$3"
      paddingInline="$3"
      borderTopLeftRadius="$10"
      borderTopRightRadius="$2"
      borderBottomRightRadius="$10"
      borderBottomLeftRadius="$2"
      maxW={700}
    >
      <SizableText size="$2" textTransform="uppercase" color="$gray11">
        {artwork.artist}
      </SizableText>
      <SizableText
        size="$4"
        fontFamily="$heading"
        fontStyle="italic"
        color="$gray11"
      >
        {artwork.title}
      </SizableText>
      <XStack gap="$3">
        <SizableText size="$2" color="$gray11">
          {artwork.year}
        </SizableText>
        <SizableText size="$2" color="$gray11">
          {artwork.medium}
        </SizableText>
      </XStack>
    </YStack>
  );
}
