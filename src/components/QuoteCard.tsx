import { Separator } from "tamagui";

import {
  QuoteContainer,
  QuoteText,
  QuoteAuthor,
} from "@/styles/StyledQuoteCard";

interface QuoteCardProps {
  content: string;
  author: string;
}

export function QuoteCard({ content, author }: QuoteCardProps) {
  return (
    <QuoteContainer>
      <QuoteText>"{content}"</QuoteText>
      <Separator borderColor="$gray7" />
      <QuoteAuthor>{author}</QuoteAuthor>
    </QuoteContainer>
  );
}
