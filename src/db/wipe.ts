import { db } from "@/db";
import { quotes, artworks, articles } from "@/db/schema";

/**
 * Deletes all rows from every table in dependency order to avoid
 * foreign key violations: quotes → artworks → articles.
 */
export async function wipeDatabase() {
  await db.delete(quotes);
  await db.delete(artworks);
  await db.delete(articles);

  console.log("Database wiped.");
}

wipeDatabase().catch(console.error);
