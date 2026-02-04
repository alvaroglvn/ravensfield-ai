import { Image as ExpoImage } from "expo-image";
import { createImage } from "tamagui";

export const Image = createImage({
  Component: ExpoImage,
  resizeModePropName: "contentFit",
  objectPositionPropName: "contentPosition",
});
export type ExpoImageProps = React.ComponentProps<typeof Image>;
