import { styled, Paragraph, H1 } from "tamagui";

import { ARTICLE_MAX_WIDTH } from "@/styles/layout";

export const ArticleTitle = styled(H1, {
  fontSize: 52,
  color: "$color",
});

export const ArticleBody = {
  maxWidth: ARTICLE_MAX_WIDTH,
} as const;

export const ArticleParagraph = styled(Paragraph, {
  fontSize: "$4",
  lineHeight: "$5",
  color: "$gray11",
});
