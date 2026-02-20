import { styled, YStack, SizableText } from "tamagui";

export const QuoteContainer = styled(YStack, {
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

export const QuoteText = styled(SizableText, {
  size: "$4",
  fontFamily: "$heading",
  fontStyle: "italic",
  color: "$gray11",
  lineHeight: "$5",
});

export const QuoteAuthor = styled(SizableText, {
  size: "$2",
  textTransform: "uppercase",
  color: "$gray10",
  letterSpacing: 1,
});
