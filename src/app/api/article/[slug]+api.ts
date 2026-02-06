import { executeQuery } from "@/db";

interface ArticleRow {
  id: number;
  slug: string;
  title: string;
  seoDescription: string;
  content: string;
  createdAt: string;
  // Artwork fields (prefixed)
  artworkId: number | null;
  artworkTitle: string | null;
  artworkYear: string | null;
  artworkType: string | null;
  artworkMedium: string | null;
  artworkArtist: string | null;
  artworkImagePrompt: string | null;
  artworkImageUrl: string | null;
}

interface QuoteRow {
  id: number;
  content: string;
  author: string;
}

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

    // Fetch article with artwork
    const articles = await executeQuery<ArticleRow>(
      `
      SELECT 
        articles.id,
        articles.slug,
        articles.title,
        articles.seo_description as seoDescription,
        articles.content,
        articles.created_at as createdAt,
        artworks.id as artworkId,
        artworks.title as artworkTitle,
        artworks.year as artworkYear,
        artworks.type as artworkType,
        artworks.medium as artworkMedium,
        artworks.artist as artworkArtist,
        artworks.image_prompt as artworkImagePrompt,
        artworks.image_url as artworkImageUrl
      FROM articles
      LEFT JOIN artworks ON articles.id = artworks.article_id
      WHERE articles.slug = ?
      LIMIT 1
    `,
      [slug],
    );

    if (articles.length === 0) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    const articleRow = articles[0];

    // Fetch quotes for this article
    const quotes = await executeQuery<QuoteRow>(
      `
      SELECT id, content, author
      FROM quotes
      WHERE article_id = ?
    `,
      [articleRow.id],
    );

    // Build the response
    const article = {
      id: articleRow.id,
      slug: articleRow.slug,
      title: articleRow.title,
      seoDescription: articleRow.seoDescription,
      content: articleRow.content,
      createdAt: articleRow.createdAt,
      artwork: articleRow.artworkId
        ? {
            id: articleRow.artworkId,
            title: articleRow.artworkTitle,
            year: articleRow.artworkYear,
            type: articleRow.artworkType,
            medium: articleRow.artworkMedium,
            artist: articleRow.artworkArtist,
            imagePrompt: articleRow.artworkImagePrompt,
            imageUrl: articleRow.artworkImageUrl,
          }
        : null,
      quotes,
    };

    return Response.json(article);
  } catch (error) {
    return Response.json(
      { error: `Failed to fetch article data: ${error}` },
      { status: 500 },
    );
  }
}
