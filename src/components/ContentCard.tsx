import { XStack, Card, H3, Paragraph, Text, Theme, YStack } from "tamagui";
import { useRouter } from "expo-router";

import { Image } from "@/components/ExpoImage";
import { X } from "@tamagui/lucide-icons";

interface ContentCardProps {
  slug: string;
  imageUrl: string;
  type: string;
  title: string;
  seoDescription: string;
  isNew?: boolean;
  variant?: "default" | "compact";
}

export function ContentCard({
  slug,
  imageUrl,
  type,
  title,
  seoDescription,
  isNew = false,
  variant = "default",
}: ContentCardProps) {
  const router = useRouter();

  if (variant === "compact") {
    return (
      <Theme name="inverse">
        <Card
          elevation={2}
          borderTopLeftRadius="$6"
          borderTopRightRadius="$2"
          borderBottomRightRadius="$6"
          borderBottomLeftRadius="$2"
          overflow="hidden"
          scale={1}
          cursor="pointer"
          transition="slow"
          hoverStyle={{ scale: 1.01 }}
          pressStyle={{ scale: 0.98 }}
          minHeight={95}
        >
          <XStack height="100%">
            <Image src={imageUrl} width="35%" />
            <YStack
              paddingBlock="$3"
              paddingInline="$3"
              flex={1}
              justifyContent="center"
              alignItems="flex-end"
            >
              <Text
                fontSize={"$2"}
                style={{
                  textAlign: "right",
                }}
              >
                {type}
              </Text>
              <H3
                fontSize={"$4"}
                style={{
                  textAlign: "right",
                }}
              >
                {title}
              </H3>
            </YStack>
          </XStack>
        </Card>
      </Theme>
    );
  }

  return (
    <Theme name="inverse">
      <Card
        elevation={2}
        maxHeight={500}
        minHeight={400}
        borderTopLeftRadius="$12"
        borderTopRightRadius="$2"
        borderBottomRightRadius="$12"
        borderBottomLeftRadius="$2"
        overflow="hidden"
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
  );
}
export type ContentCardPropsType = ContentCardProps;
