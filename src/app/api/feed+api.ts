import { db } from "@/db";

// --- The feed will load 5 content cards: one hero and for list items ---
export async function GET(request: Request): Promise<Response> {
  try {
    const data = await db.query.articles.findMany({
      orderBy: (articles, { desc }) => [desc(articles.createdAt)],
      limit: 5,

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
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch feed data: ${error}` },
      { status: 500 },
    );
  }
}
