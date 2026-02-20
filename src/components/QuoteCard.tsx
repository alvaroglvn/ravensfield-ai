import { YStack, SizableText, Separator } from "tamagui";

interface QuoteCardProps {
  content: string;
  author: string;
}

export function QuoteCard({ content, author }: QuoteCardProps) {
  return (
    <YStack
      borderWidth={2}
      borderColor="$gray8"
      paddingBlock="$5"
      paddingInline="$5"
      borderTopLeftRadius="$10"
      borderTopRightRadius="$2"
      borderBottomRightRadius="$10"
      borderBottomLeftRadius="$2"
      gap="$3"
    >
      <SizableText
        size="$4"
        fontFamily="$heading"
        fontStyle="italic"
        color="$gray11"
        lineHeight="$5"
      >
        "{content}"
      </SizableText>
      <Separator borderColor="$gray7" />
      <SizableText
        size="$2"
        textTransform="uppercase"
        color="$gray10"
        letterSpacing={1}
      >
        {author}
      </SizableText>
    </YStack>
  );
}
