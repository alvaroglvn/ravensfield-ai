import { visionRequest } from "@/services/AIGen/anthropic";
import { db } from "@/db";
import { articles, artworks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function visionConsistencyCheck(articleId: number) {
  try {
    const uneditedStory = await db
      .select({ content: articles.content })
      .from(articles)
      .where(eq(articles.id, articleId));

    const imageUrl = await db
      .select({ imageUrl: artworks.imageUrl })
      .from(artworks)
      .where(eq(artworks.articleId, articleId));

    const editedStory = await visionRequest(
      imageUrl[0].imageUrl,
      uneditedStory[0].content,
    );
    if (!editedStory) {
      throw new Error("Failed to receive edited story from vision request");
    }
    console.log(
      "Storing edited story back to database for article ID:",
      articleId,
    );
    await db
      .update(articles)
      .set({ content: editedStory })
      .where(eq(articles.id, articleId));
  } catch (error) {
    console.error("Error during vision consistency check:", error);
  }
}
