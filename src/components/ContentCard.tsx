import { Card, H3, Paragraph, Text, Theme, YStack, YStackProps, styled } from "tamagui";
import { useRouter } from "expo-router";

import { Image } from "@/components/ExpoImage";
import { Ribbon } from "@/components/Ribbon";
import { CardWrapper, StyledCard } from "@/styles/StyledContentCard";

const CardTypeLabel = styled(Text, {
  fontSize: "$2",
  color: "$gray11",
  textTransform: "uppercase",
});

interface ContentCardProps extends YStackProps {
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
  ...rest
}: ContentCardProps) {
  const router = useRouter();

  return (
    <Theme name="inverse">
      <CardWrapper onPress={() => router.push(`/articles/${slug}`)} {...rest}>
        {isNew && <Ribbon label="New Acquisition" />}
        <StyledCard size="default" flex={1}>
          <YStack flex={1} width="100%" overflow="hidden">
            <Image
              src={imageUrl}
              width="100%"
              height="100%"
              contentFit="cover"
              contentPosition="top"
            />
          </YStack>
          <Card.Header flexWrap="wrap">
            <CardTypeLabel>{type}</CardTypeLabel>
            <H3 size="$5" numberOfLines={2} ellipsis>
              {title}
            </H3>
            <Paragraph size="$2" marginBlock="$3">
              {seoDescription}
            </Paragraph>
          </Card.Header>
        </StyledCard>
      </CardWrapper>
    </Theme>
  );
}
