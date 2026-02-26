import { styled, YStack, SizableText } from "tamagui";

const QuoteContainer = styled(YStack, {
  borderWidth: 2,
  borderColor: "$gray8",
  paddingBlock: "$5",
  paddingInline: "$5",
  borderTopLeftRadius: "$10",
  borderTopRightRadius: "$2",
  borderBottomRightRadius: "$10",
  borderBottomLeftRadius: "$2",
  gap: "$3",
});

const QuoteText = styled(SizableText, {
  size: "$4",
  fontFamily: "$heading",
  fontStyle: "italic",
  color: "$gray10",
  lineHeight: "$5",
});

const QuoteAuthor = styled(SizableText, {
  size: "$2",
  textTransform: "uppercase",
  color: "$gray10",
  letterSpacing: 1,
});

interface QuoteCardProps {
  content: string;
  author: string;
}

export function QuoteCard({ content, author }: QuoteCardProps) {
  return (
    <QuoteContainer>
      <QuoteText>"{content}"</QuoteText>
      <QuoteAuthor>{author}</QuoteAuthor>
    </QuoteContainer>
  );
}
