import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";

export async function generateSeoDescriptions() {
  // 1. Fetch articles with no SEO description
  const rows = await db
    .select({ id: articles.id, title: articles.title, content: articles.content })
    .from(articles)
    .where(isNull(articles.seoDescription));

  if (rows.length === 0) {
    console.log("No articles need SEO descriptions.");
    return;
  }

  console.log(`Generating SEO descriptions for ${rows.length} articles...`);

  // Truncate content to keep the prompt a reasonable size
  const input = rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content.slice(0, 800),
  }));

  // 2. Ask Claude to write descriptions in one batch
  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are an SEO copywriter for a literary arts magazine. For each article below, write a compelling meta description between 140 and 160 characters. It should summarise the piece and entice the reader.

Return ONLY a JSON array — no markdown, no explanation — where each element is { "id": <number>, "description": "<text>" }.

Articles:
${JSON.stringify(input, null, 2)}`,
      },
    ],
  });

  // 3. Parse response (strip markdown fences if present)
  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";
  const json = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const results: Array<{ id: number; description: string }> = JSON.parse(json);

  // 4. Update DB
  let updated = 0;
  for (const { id, description } of results) {
    if (!description?.trim()) {
      console.warn(`Empty description for article id ${id} — skipping`);
      continue;
    }
    await db
      .update(articles)
      .set({ seoDescription: description.trim() })
      .where(eq(articles.id, id));
    updated++;
  }

  console.log(`Done — updated ${updated} articles.`);
}

generateSeoDescriptions().catch(console.error);
