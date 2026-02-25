import { getArticleData } from "@/lib/data";

export async function GET(
  _request: Request,
  { slug }: { slug: string },
): Promise<Response> {
  try {
    if (!slug) {
      return Response.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    const article = await getArticleData(slug);

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
