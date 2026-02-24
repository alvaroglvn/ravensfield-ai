import { db } from "@/db";
import { artworks } from "@/db/schema";
import { eq } from "drizzle-orm";

const TYPE_MAP: Record<string, string> = {
  objectdart: "object d'art",
  "archaeological-finding": "archaeological finding",
};

export async function GET(
  _request: Request,
  { type }: { type: string }
): Promise<Response> {
  try {
    const canonicalType = TYPE_MAP[type] ?? decodeURIComponent(type);

    const rows = await db.query.artworks.findMany({
      where: eq(artworks.type, canonicalType),
      orderBy: (artworks, { desc }) => [desc(artworks.createdAt)],
      columns: { imageUrl: true, type: true },
      with: { article: { columns: { slug: true, title: true, seoDescription: true } } },
    });

    const data = rows
      .filter((row) => row.article != null)
      .map((row) => ({
        slug: row.article.slug,
        title: row.article.title,
        seoDescription: row.article.seoDescription,
        artwork: { imageUrl: row.imageUrl, type: row.type },
      }));

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: `Failed to fetch category: ${error}` }, { status: 500 });
  }
}
