import { Leonardo } from "@leonardo-ai/sdk";
import { imageGetGenerationById } from "@leonardo-ai/sdk/funcs/imageGetGenerationById";
import { JobStatus } from "@leonardo-ai/sdk/sdk/models/shared";

import { setLeonardoParameters } from "@/services/AIGen/leonardo/set-parameters";

// Client
const leonardo = new Leonardo({
  bearerAuth: process.env.LEONARDO_API_KEY,
});

// Image Generation
export async function generateLeonardoImage(
  prompt: string,
  width: number,
  height: number,
): Promise<string> {
  const generationParams = setLeonardoParameters(prompt, width, height);

  const result = await leonardo.image.createGeneration(generationParams, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 500,
        maxInterval: 6000,
        exponent: 1.5,
        maxElapsedTime: 30000,
      },
      retryConnectionErrors: true,
    },
  });

  if (result.statusCode === 200) {
    const generationId = result.object?.sdGenerationJob?.generationId;
    return generationId as string;
  } else {
    throw new Error(`Leonardo image generation failed: ${result.statusCode}`);
  }
}

// Obtain Generated Image URL
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLeonardoImageUrl(
  generationId: string,
): Promise<string> {
  const pollInterval = 3000; // 3 seconds
  const maxAttempts = 20; // Max 1 minute

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const generationStatusResponse = await imageGetGenerationById(
      leonardo,
      generationId,
    );
    const generation = generationStatusResponse.value?.object;
    const status = generation?.generationsByPk?.status;

    if (status === JobStatus.Complete) {
      const imageUrl = generation?.generationsByPk?.generatedImages?.[0]?.url;

      if (!imageUrl) {
        throw new Error("Image URL not found after generation completed.");
      } else {
        return imageUrl;
      }
    } else if (status === JobStatus.Failed) {
      throw new Error("Image generation failed.");
    } else {
      await sleep(pollInterval);
    }
  }
  throw new Error("Image generation timed out.");
}
