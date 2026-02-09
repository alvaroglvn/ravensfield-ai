import {
  XStack,
  Card,
  H3,
  Paragraph,
  Text,
  Theme,
  YStack,
  YStackProps,
} from "tamagui";
import { useRouter } from "expo-router";

import { Image } from "@/components/ExpoImage";
import { Ribbon } from "@/components/Ribbon";
import { CardWrapper, StyledCard } from "@/styles/StyledContentCard";
import { is } from "drizzle-orm";

interface ContentCardProps extends YStackProps {
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
  ...rest
}: ContentCardProps) {
  const router = useRouter();
  const isCompact = variant === "compact";

  return (
    <Theme name="inverse">
      <CardWrapper onPress={() => router.push(`/articles/${slug}`)} {...rest}>
        {/* Only show Ribbon in default mode */}
        {isNew && !isCompact && <Ribbon label="New Acquisition" />}

        <StyledCard size={variant} flex={isCompact ? undefined : 1}>
          {/* LAYOUT A: Compact (Horizontal) */}
          {isCompact ? (
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
          ) : (
            /* LAYOUT B: Default (Vertical) */
            <>
              <YStack flex={1} width="100%" overflow="hidden">
                {/* IMAGE: Just fills the wrapper */}
                <Image
                  src={imageUrl}
                  width="100%"
                  height="100%"
                  contentFit="cover"
                  contentPosition="top"
                />
              </YStack>
              <Card.Header flexWrap="wrap">
                <Text fontSize="$4" color="$gray11" textTransform="uppercase">
                  {type}
                </Text>
                <H3 size="$5" numberOfLines={2} ellipsis>
                  {title}
                </H3>
                <Paragraph size="$2" marginBlock={15}>
                  {seoDescription}
                </Paragraph>
              </Card.Header>
            </>
          )}
        </StyledCard>
      </CardWrapper>
    </Theme>
  );
}

export type ContentCardPropsType = ContentCardProps;
