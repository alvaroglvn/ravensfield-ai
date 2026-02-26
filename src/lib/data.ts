import { db } from "@/db";
import { articles, artworks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const TYPE_MAP: Record<string, string> = {
  objectdart: "object d'art",
  "archaeological-finding": "archaeological finding",
};

export async function getFeedData() {
  return db.query.articles.findMany({
    orderBy: (articles, { desc }) => [desc(articles.createdAt)],
    limit: 6,
    columns: {
      id: true,
      title: true,
      slug: true,
      seoDescription: true,
      createdAt: true,
    },
    with: {
      artwork: {
        columns: {
          imageUrl: true,
          type: true,
        },
      },
    },
  });
}

export async function getArticleData(slug: string) {
  return db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    with: {
      artwork: true,
      quotes: true,
    },
  });
}

export async function getCategoryData(type: string) {
  const canonicalType = TYPE_MAP[type] ?? decodeURIComponent(type);
  const rows = await db.query.artworks.findMany({
    where: eq(artworks.type, canonicalType),
    orderBy: (artworks, { desc }) => [desc(artworks.createdAt)],
    columns: { imageUrl: true, type: true },
    with: { article: { columns: { slug: true, title: true, seoDescription: true } } },
  });
  return rows
    .filter((row) => row.article != null)
    .map((row) => ({
      slug: row.article.slug,
      title: row.article.title,
      seoDescription: row.article.seoDescription,
      artwork: { imageUrl: row.imageUrl, type: row.type },
    }));
}
