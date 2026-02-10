import { executeQuery } from "@/db";
import { OutputSchemaType } from "@/services/AIGen/anthropic";

// Slug from title helper
import { createSlugFromTitle } from "@/utils/slug-from-title";

export async function storeGeneratedData(
  data: OutputSchemaType,
): Promise<number> {
  try {
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("No items present in generated data to store");
    }

    // Assumes one item per run; returns artwork id for the first item
    let newArtworkId: number | undefined;

    for (const item of data.items) {
      const slug = createSlugFromTitle(item.title);

      // 1) Insert article
      await executeQuery(
        `INSERT INTO articles (slug, title, seo_description, content) VALUES (?, ?, ?, ?)`,
        [slug, item.title, item.seoDescription, item.content],
      );

      const articleRows = await executeQuery<{ id: number }>(
        `SELECT id FROM articles WHERE slug = ? LIMIT 1`,
        [slug],
      );
      if (articleRows.length === 0) {
        throw new Error("Failed to read back inserted article id");
      }
      const articleId = articleRows[0].id;

      // 2) Insert artwork
      await executeQuery(
        `INSERT INTO artworks (article_id, title, year, type, medium, artist, image_prompt, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          articleId,
          item.artwork.title,
          item.artwork.year,
          item.artwork.type,
          item.artwork.medium,
          item.artwork.artist,
          item.artwork.imagePrompt,
          "PENDING_GENERATION",
        ],
      );

      const artworkRows = await executeQuery<{ id: number }>(
        `SELECT id FROM artworks WHERE article_id = ? LIMIT 1`,
        [articleId],
      );
      if (artworkRows.length === 0) {
        throw new Error("Failed to read back inserted artwork id");
      }
      newArtworkId = artworkRows[0].id;

      // 3) Insert quotes (if any)
      const generatedQuotes = (item.quotes || []).map((quote) => [
        articleId,
        quote.content,
        quote.author,
      ]);

      if (generatedQuotes.length > 0) {
        // Build multi-row INSERT
        const placeholders = generatedQuotes.map(() => `(?, ?, ?)`).join(", ");
        const flatValues = generatedQuotes.flat();
        await executeQuery(
          `INSERT INTO quotes (article_id, content, author) VALUES ${placeholders}`,
          flatValues,
        );
      }
    }

    if (!newArtworkId) {
      throw new Error("No artwork id was created during storage pipeline");
    }

    return newArtworkId;
  } catch (error) {
    console.error("Error storing generated data:", error);
    throw error;
  }
}
