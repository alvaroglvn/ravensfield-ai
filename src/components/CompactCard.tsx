import { H3, Text, Theme, XStack, YStack, YStackProps } from "tamagui";
import { useRouter } from "expo-router";

import { Image } from "@/components/ExpoImage";
import { CardWrapper, StyledCard } from "@/styles/StyledContentCard";

interface CompactCardProps extends YStackProps {
  slug: string;
  imageUrl: string;
  type: string;
  title: string;
}

export function CompactCard({
  slug,
  imageUrl,
  type,
  title,
  ...rest
}: CompactCardProps) {
  const router = useRouter();

  return (
    <Theme name="inverse">
      <CardWrapper onPress={() => router.push(`/articles/${slug}`)} {...rest}>
        <StyledCard size="compact">
          <XStack height="100%" gap="$3">
            <Image src={imageUrl} width="35%" contentPosition="center" />
            <YStack
              paddingBlock="$4"
              flex={1}
              justify="center"
              items="flex-start"
              gap="$1.5"
            >
              <Text
                fontSize="$2"
                color="$gray11"
                textTransform="uppercase"
                numberOfLines={1}
              >
                {type}
              </Text>
              <H3 fontSize="$3" lineHeight="$4" numberOfLines={2} ellipsis>
                {title}
              </H3>
            </YStack>
          </XStack>
        </StyledCard>
      </CardWrapper>
    </Theme>
  );
}
