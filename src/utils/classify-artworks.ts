import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { artworks } from "@/db/schema";
import { eq } from "drizzle-orm";

const VALID_TYPES = [
  "painting",
  "sculpture",
  "drawing",
  "photography",
  "object d'art",
  "archaeological finding",
] as const;

export async function classifyArtworks() {
  // 1. Fetch all artworks that still need classification
  const rows = await db
    .select({ id: artworks.id, medium: artworks.medium })
    .from(artworks)
    .where(eq(artworks.type, "PENDING"));

  if (rows.length === 0) {
    console.log("No artworks to classify.");
    return;
  }

  console.log(`Classifying ${rows.length} artworks...`);

  // 2. Ask Claude to classify in one batch
  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are an art curator. For each artwork below, pick the single most fitting category from this list:
painting | sculpture | drawing | photography | object d'art | archaeological finding

Return ONLY a JSON array — no markdown, no explanation — where each element is { "id": <number>, "type": "<category>" }.

Artworks:
${JSON.stringify(rows, null, 2)}`,
      },
    ],
  });

  // 3. Parse response (strip markdown fences if present)
  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";
  const json = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const classifications: Array<{ id: number; type: string }> = JSON.parse(json);

  // 4. Update DB
  let updated = 0;
  for (const { id, type } of classifications) {
    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      console.warn(`Unexpected type "${type}" for id ${id} — skipping`);
      continue;
    }
    await db.update(artworks).set({ type }).where(eq(artworks.id, id));
    updated++;
  }

  console.log(`Done — updated ${updated} artworks.`);
}

classifyArtworks().catch(console.error);
