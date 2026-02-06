import { db } from "@/db";
import { articles, artworks, quotes } from "@/db/schema";
import { OutputSchemaType } from "@/services/AIGen/anthropic";

// Slug from title helper
import { createSlugFromTitle } from "@/utils/slug-from-title";

export async function storeGeneratedData(
  data: OutputSchemaType,
): Promise<number> {
  try {
    // We will need this id to store the generated artwork image url later
    // This assumes only ONE ITEM is generated per pipeline run
    let newArtworkId: number | undefined;

    await db.transaction(async (tx) => {
      for (const item of data.items) {
        // --- 1. INSERT ARTICLE ---
        const [newArticle] = await tx
          .insert(articles)
          .values({
            slug: createSlugFromTitle(item.title),
            title: item.title,
            seoDescription: item.seoDescription,
            content: item.content,
          })
          .returning({ id: articles.id });

        const articleId = newArticle.id;

        // --- 2. INSERT ARTWORK  ---
        const [newArtwork] = await tx
          .insert(artworks)
          .values({
            articleId: articleId,
            title: item.artwork.title,
            year: item.artwork.year,
            type: item.artwork.type,
            medium: item.artwork.medium,
            artist: item.artwork.artist,
            imagePrompt: item.artwork.imagePrompt,
            imageUrl: "PENDING_GENERATION",
          })
          .returning({ id: artworks.id });

        newArtworkId = newArtwork.id;

        // --- 3. INSERT QUOTES  ---
        const generatedQuotes = item.quotes.map((quote) => ({
          articleId: articleId,
          content: quote.content,
          author: quote.author,
        }));

        await tx.insert(quotes).values(generatedQuotes);
      }
    });
    return newArtworkId!;
  } catch (error) {
    console.error(
      "Error storing generated data. Rolled back transaction:",
      error,
    );
    throw error;
  }
}
