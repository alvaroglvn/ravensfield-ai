import fs from "fs";
import path from "path";
import { db } from "@/db";
import { articles, artworks, quotes } from "@/db/schema";

// --- Types ---

interface GhostPost {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
  custom_excerpt: string | null;
  plaintext: string | null;
  html: string | null;
  feature_image: string | null;
}

interface GhostPostMeta {
  post_id: string;
  feature_image_caption: string | null;
}

// --- Caption helpers ---

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function parseCaption(raw: string) {
  const text = stripHtml(raw);
  // Split by | and drop empty segments (handles leading/trailing pipes)
  const parts = text
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 3) return null;

  const [artist, rawTitleYear, medium] = parts;
  // Capture any (...) at end of title field, not just 4-digit years
  const yearMatch = rawTitleYear.match(/\(([^)]+)\)$/);

  return {
    artist,
    title: rawTitleYear.replace(/\s*\([^)]+\)$/, "").trim(),
    year: yearMatch?.[1] ?? "PENDING",
    medium,
  };
}

// --- Quote helpers ---

function extractQuotesFromPost(
  post: GhostPost
): Array<{ content: string; author: string }> {
  const html = post.html ?? "";
  const blockquotes = [
    ...html.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi),
  ];
  const results: Array<{ content: string; author: string }> = [];

  for (const [, inner] of blockquotes) {
    const match = inner.match(
      /^([\s\S]+?)(?:<br\s*\/?>\s*){1,2}(-?\s*[^<\n]{2,120})\s*$/i
    );
    if (!match) continue;

    const [, rawContent, , rawAuthor] = match;
    const author = rawAuthor.replace(/^-\s*/, "").trim();
    const content = rawContent
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!author || !content) continue;
    results.push({ content, author });
  }

  return results;
}

// --- Migration ---

export async function migrateGhostData() {
  const filePath = path.join(
    process.cwd(),
    "ghost-data",
    "the-ravensfield-collection.ghost.2026-02-10-14-35-15.json"
  );

  const { data } = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Build caption lookup from posts_meta (keyed by post_id)
  const metaMap = new Map<string, string>();
  for (const m of data.posts_meta as GhostPostMeta[]) {
    if (m.feature_image_caption) metaMap.set(m.post_id, m.feature_image_caption);
  }

  const posts = (data.posts as GhostPost[]).filter((p) => {
    if (p.status !== "published" || p.slug === "info") return false;
    const year = p.published_at ? new Date(p.published_at).getFullYear() : 0;
    return year === 2025 || year === 2026;
  });

  console.log(`Migrating ${posts.length} published posts...`);
  let migrated = 0;
  let skipped = 0;

  for (const post of posts) {
    try {
      const [article] = await db
        .insert(articles)
        .values({
          slug: post.slug,
          title: post.title,
          seoDescription: post.custom_excerpt ?? null,
          content: (post.plaintext ?? "").trim(),
        })
        .onConflictDoNothing()
        .returning({ id: articles.id });

      if (!article) {
        skipped++;
        continue;
      }

      const caption = parseCaption(metaMap.get(post.id) ?? "");

      // artwork.type and artwork.imagePrompt are AI-generated and not present
      // in the Ghost export — seeded as "PENDING" for the AI pipeline.
      await db.insert(artworks).values({
        articleId: article.id,
        imageUrl: post.feature_image ?? "",
        artist: caption?.artist ?? "PENDING",
        title: caption?.title ?? "PENDING",
        year: caption?.year ?? "PENDING",
        medium: caption?.medium ?? "PENDING",
        type: "PENDING",
        imagePrompt: "PENDING",
      });

      const postQuotes = extractQuotesFromPost(post);
      if (postQuotes.length > 0) {
        await db.insert(quotes).values(
          postQuotes.map((q) => ({
            articleId: article.id,
            content: q.content,
            author: q.author,
          }))
        );
      }

      migrated++;
    } catch (err) {
      console.error(`Skipped "${post.slug}":`, (err as Error).message);
      skipped++;
    }
  }

  console.log(`Done — migrated: ${migrated}, skipped: ${skipped}`);
}

migrateGhostData().catch(console.error);
