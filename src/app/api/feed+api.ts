import { executeQuery } from "@/db";

interface FeedItem {
  id: number;
  title: string;
  slug: string;
  seoDescription: string;
  createdAt: string;
  imageUrl: string;
  type: string;
}

// --- The feed will load 5 content cards: one hero and four list items ---
export async function GET(request: Request): Promise<Response> {
  try {
    const data = await executeQuery<FeedItem>(`
      SELECT 
        articles.id,
        articles.title,
        articles.slug,
        articles.seo_description as seoDescription,
        articles.created_at as createdAt,
        artworks.image_url as imageUrl,
        artworks.type
      FROM articles
      LEFT JOIN artworks ON articles.id = artworks.article_id
      ORDER BY articles.created_at DESC
      LIMIT 6
    `);

    // Transform to match expected format with nested artwork
    const transformed = data.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      seoDescription: item.seoDescription,
      createdAt: item.createdAt,
      artwork: {
        imageUrl: item.imageUrl,
        type: item.type,
      },
    }));

    return Response.json(transformed);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch feed data: ${error}` },
      { status: 500 },
    );
  }
}
