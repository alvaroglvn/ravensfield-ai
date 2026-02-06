import React from "react";
import { SizableText } from "tamagui";

type Artwork = {
  title?: string | null;
  year?: string | number | null;
  medium?: string | null;
  artist?: string | null;
};

export function MuseumTag({ artwork }: { artwork?: Artwork | null }) {
  if (!artwork) return null;

  return (
    <SizableText
      fontSize="$3"
      marginVertical="$4"
      color="$color"
      opacity={0.5}
      textAlign="center"
      backgroundColor="$background"
    >
      {artwork.artist} | {artwork.title} ({artwork.year}) | {artwork.medium}
    </SizableText>
  );
}
