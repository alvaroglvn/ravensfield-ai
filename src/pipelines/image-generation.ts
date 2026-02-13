import {
  generateLeonardoImage,
  getLeonardoImageUrl,
} from "@/services/AIGen/leonardo/generate-image";
import { getRandomImgSize } from "@/utils/randomize-img-size";

export async function leonardoGeneration(
  prompt: string,
): Promise<string | void> {
  try {
    const [width, height] = getRandomImgSize();
    const generationId = await generateLeonardoImage(prompt, width, height);
    if (!generationId) {
      throw new Error("Leonardo returned no Generation ID.");
    }

    const imageUrl = await getLeonardoImageUrl(generationId);
    if (!imageUrl) {
      throw new Error("Leonardo returned no Image URL.");
    }

    return imageUrl;
  } catch (error) {}
}
