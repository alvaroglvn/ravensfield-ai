import { db } from "@/db";
import * as schema from "@/db/schema";
import { createSlugFromTitle } from "@/utils/slug-from-title";

export type ArticleData = {
  title: string;
  seoDescription: string;
  content: string;
};

export type ArtworkData = {
  articleId: number;
  title: string;
  year: string;
  type: string;
  medium: string;
  artist: string;
  imagePrompt: string;
  imageUrl: string;
};

export type QuoteData = {
  content: string;
  author: string;
};

export async function storeArticle(article: ArticleData): Promise<number> {
  // --- Create slug from title ---
  const slug = createSlugFromTitle(article.title);

  const [newArticle] = await db
    .insert(schema.articles)
    .values({
      slug: slug,
      title: article.title,
      seoDescription: article.seoDescription,
      content: article.content,
    })
    .returning({ id: schema.articles.id });

  return newArticle.id;
}

export async function storeArtwork(artworkData: ArtworkData): Promise<void> {
  await db.insert(schema.artworks).values({
    articleId: artworkData.articleId,
    title: artworkData.title,
    year: artworkData.year,
    type: artworkData.type,
    medium: artworkData.medium,
    artist: artworkData.artist,
    imagePrompt: artworkData.imagePrompt,
    imageUrl: artworkData.imageUrl,
  });
}

export async function storeQuote(
  articleId: number,
  quoteData: QuoteData,
): Promise<void> {
  await db.insert(schema.quotes).values({
    articleId: articleId,
    content: quoteData.content,
    author: quoteData.author,
  });
}
