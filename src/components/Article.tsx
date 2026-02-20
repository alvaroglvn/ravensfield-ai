import { YStack, H1, Paragraph, styled } from "tamagui";
import { useMemo } from "react";

import { QuoteCard } from "@/components/QuoteCard";

const ArticleParagraph = styled(Paragraph, {
  fontSize: "$4",
  lineHeight: "$5",
  color: "$gray11",
});

interface Quote {
  content: string;
  author: string;
}

interface ArticleProps {
  title: string;
  content: string;
  quotes: Quote[];
}

export function Article({ title, content, quotes }: ArticleProps) {
  const paragraphs = useMemo(
    () => content.split(/\n+/).map((p) => p.trim()).filter(Boolean),
    [content],
  );

  // Pick random insertion indices (one quote per slot, no two adjacent).
  // Seeded by title char codes so the layout is stable across renders.
  const insertionMap = useMemo<Map<number, Quote>>(() => {
    const map = new Map<number, Quote>();
    if (quotes.length === 0 || paragraphs.length < 2) return map;

    // Shuffle quotes deterministically using title char codes as a seed.
    const seed = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const shuffled = [...quotes].sort(
      (a, b) =>
        ((seed * (quotes.indexOf(a) + 1)) % 97) -
        ((seed * (quotes.indexOf(b) + 1)) % 97),
    );

    // Candidate slots: after paragraph 0 up to second-to-last paragraph.
    const slots = Array.from(
      { length: paragraphs.length - 1 },
      (_, i) => i + 1,
    );

    // Space quotes out: pick every ~nth slot so they don't cluster.
    const step = Math.max(1, Math.floor(slots.length / shuffled.length));
    shuffled.forEach((quote, i) => {
      const idx = slots[Math.min(i * step, slots.length - 1)];
      if (idx !== undefined) map.set(idx, quote);
    });

    return map;
  }, [quotes, paragraphs.length, title]);

  const body = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    paragraphs.forEach((paragraph, i) => {
      if (insertionMap.has(i)) {
        const quote = insertionMap.get(i)!;
        nodes.push(
          <QuoteCard
            key={`quote-${i}`}
            content={quote.content}
            author={quote.author}
          />,
        );
      }
      nodes.push(
        <ArticleParagraph key={`p-${i}`}>{paragraph}</ArticleParagraph>,
      );
    });
    return nodes;
  }, [paragraphs, insertionMap]);

  return (
    <YStack role="article" width="100%" maxW={850} gap="$5" self="center">
      <H1 fontSize={52} color="$color">{title}</H1>
      <YStack role="region" gap="$4">
        {body}
      </YStack>
    </YStack>
  );
}
