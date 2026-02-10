import {
  generateLeonardoImage,
  getLeonardoImageUrl,
} from "@/services/AIGen/leonardo/generate-image";
import { getRandomImgSize } from "@/utils/randomize-img-size";
import { executeQuery } from "@/db";

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

    // --- Store image URL in database ---
    await executeQuery(`UPDATE artworks SET image_url = ? WHERE id = ?`, [
      imageUrl,
      artworkId,
    ]);

    // Confirm update
    const check = await executeQuery<{ id: number }>(
      `SELECT id FROM artworks WHERE id = ? LIMIT 1`,
      [artworkId],
    );
    if (check.length === 0) {
      throw new Error(
        `DB Update Failed: Could not find artwork with ID ${artworkId}`,
      );
    }

    console.log(`   - ✅ DB Updated successfully.`);
  } catch (error) {
    console.error("❌ Error in image generation pipeline:", error);
    throw error;
  }
}
