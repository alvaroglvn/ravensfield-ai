import { Card, H3, Paragraph, Text, Theme } from "tamagui";
import { useRouter } from "expo-router";

import { Image } from "@/components/ExpoImage";

interface ContentCardProps {
  slug: string;
  imageUrl: string;
  type: string;
  title: string;
  seoDescription: string;
  isNew?: boolean;
}

export function ContentCard({
  slug,
  imageUrl,
  type,
  title,
  seoDescription,
  isNew = false,
}: ContentCardProps) {
  const router = useRouter();

  return (
    <Theme name="inverse">
      <Card
        elevation={2}
        width="100%"
        maxWidth="75%"
        position="relative"
        aspectRatio={4 / 3}
        borderWidth={1}
        borderTopLeftRadius="$2"
        borderTopRightRadius="$7"
        borderBottomRightRadius="$2"
        borderBottomLeftRadius="$7"
        scale={1}
        cursor="pointer"
        transition="slow"
        hoverStyle={{ scale: 1.01 }}
        pressStyle={{ scale: 0.98 }}
        onPress={() => router.push(`/articles/${slug}`)}
      >
        <Image src={imageUrl} width={"100%"} height={300} />
        <Card.Header>
          <Text>{type}</Text>
          <H3>{title}</H3>
          <Paragraph>{seoDescription}</Paragraph>
        </Card.Header>
        <Card.Footer></Card.Footer>
      </Card>
    </Theme>
    // <StyledCard
    //   transition="medium"
    //   gap={"$3"}
    //   onPress={() => router.push(`/articles/${slug}`)}
    // >
    //   <Image src={imageUrl} width={"100%"} height={300} />
    //   <YStack paddingBlock="$3" paddingInline="$3">
    //     <Text>{type}</Text>
    //     <H3>{title}</H3>
    //     <Paragraph marginBlock="$3" numberOfLines={3}>
    //       {seoDescription}
    //     </Paragraph>
    //   </YStack>
    // </StyledCard>
  );
}
export type ContentCardPropsType = ContentCardProps;
