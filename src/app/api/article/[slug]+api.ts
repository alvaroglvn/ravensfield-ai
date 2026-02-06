import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { slug }: { slug: string },
): Promise<Response> {
  try {
    if (!slug) {
      return Response.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    const article = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      with: { artwork: true, quotes: true },
    });

    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    return Response.json(article);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch article data: ${error}` },
      { status: 500 },
    );
  }
}
