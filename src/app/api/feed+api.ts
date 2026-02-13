import { db } from "@/db";

// --- The feed will load 6 content cards (Hero + List) ---
export async function GET(request: Request): Promise<Response> {
  try {
    // Drizzle does the SQL generation, Joining, and Mapping for us
    const data = await db.query.articles.findMany({
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
      limit: 6,

      // 1. Select Article Fields
      columns: {
        id: true,
        title: true,
        slug: true,
        seoDescription: true,
        createdAt: true,
      },

      // 2. Select Linked Artwork Fields (Auto-nested!)
      with: {
        artwork: {
          columns: {
            imageUrl: true,
            type: true, // You requested 'type' in your SQL
          },
        },
      },
    });

    // No need to manually .map()! Drizzle returns exactly:
    // [{ id: 1, title: "...", artwork: { imageUrl: "..." } }]
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch feed data: ${error}` },
      { status: 500 },
    );
  }
}
