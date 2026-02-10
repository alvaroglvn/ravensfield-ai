import {
  CreateGenerationRequestBody,
  TransparencyType,
} from "@leonardo-ai/sdk/sdk/models/operations";
import {
  SdGenerationSchedulers,
  SdGenerationStyle,
  SdVersions,
} from "@leonardo-ai/sdk/sdk/models/shared";

export function setLeonardoParameters(
  prompt: string,
  width: number,
  height: number,
): CreateGenerationRequestBody {
  let genRequestBody: CreateGenerationRequestBody = {
    // General Parameters
    modelId: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3", // Phoenix 1.0
    sdVersion: SdVersions.Phoenix,
    prompt: prompt,
    negativePrompt:
      "text, watermark, signature, blurry, low resolution, deep fried, cartoon, illustration, 3d render, plastic, deformed, ugly, mutated, distortion, oversaturated, high contrast, cgi, octane render, unreal engine, gloss, bloom",
    width: width,
    height: height,
    public: false,
    numImages: 1,

    // Phoenix 1.0 Best Practices
    alchemy: false,
    photoReal: false,
    promptMagic: false,
    enhancePrompt: false,

    // Disable legacy enhancers to keep model pure
    highContrast: false,
    highResolution: false,
    ultra: false,

    // Style and Scheduler
    presetStyle: SdGenerationStyle.Cinematic,
    scheduler: SdGenerationSchedulers.Leonardo,
    guidanceScale: 8,
    contrastRatio: 0.5,

    // Miscellaneous
    tiling: false,
    canvasRequest: false,
    transparency: TransparencyType.Disabled,
    unzoom: false,
  };

  return genRequestBody;
}
