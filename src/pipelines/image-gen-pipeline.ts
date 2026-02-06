import { eq } from "drizzle-orm";
import {
  generateLeonardoImage,
  getLeonardoImageUrl,
} from "@/services/AIGen/leonardo/generate-image";
import { getRandomImgSize } from "@/utils/randomize-img-size";
import { db } from "@/db";
import { artworks } from "@/db/schema";

export async function imageGenPipeline(prompt: string, artworkId: number) {
  try {
    console.log(`   - Generating image for Artwork ID: ${artworkId}`);

    // --- Determine image size ---\n
    const [width, height] = getRandomImgSize();

    // --- Generate new image with Leonardo ---\n
    const generationId = await generateLeonardoImage(prompt, width, height);

    if (!generationId) {
      throw new Error("Leonardo returned no Generation ID.");
    }
    console.log(`   - Leonardo Generation ID: ${generationId}`);

    // --- Obtain the generated image URL ---\n
    // NOTE: This usually involves polling (waiting). If it returns instantly with null,
    // check your polling logic inside this function.
    const imageUrl = await getLeonardoImageUrl(generationId);

    if (!imageUrl) {
      throw new Error(
        "Leonardo returned no Image URL (Generation might have failed or timed out).",
      );
    }
    console.log(`   - Got Image URL: ${imageUrl.substring(0, 30)}...`);

    // --- Store image URL in database ---\n
    await db.transaction(async (tx) => {
      const result = await tx
        .update(artworks)
        .set({
          imageUrl: imageUrl,
        })
        .where(eq(artworks.id, artworkId))
        .returning({ updatedId: artworks.id }); // Return ID to confirm update matches

      if (result.length === 0) {
        throw new Error(
          `❌ DB Update Failed: Could not find artwork with ID ${artworkId}`,
        );
      }

      console.log(`   - ✅ DB Updated successfully.`);
    });
  } catch (error) {
    console.error("❌ Error in image generation pipeline:", error);
    throw error;
  }
}
