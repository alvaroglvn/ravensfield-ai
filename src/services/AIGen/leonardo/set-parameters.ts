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
    modelId: "b2614463-296c-462a-9586-aafdb8f00e36", // Flux Dev
    sdVersion: SdVersions.FluxDev,
    prompt: prompt,
    negativePrompt:
      "text, watermark, signature, blurry, low resolution, deep fried, cartoon, illustration, 3d render, plastic, deformed, ugly, mutated, distortion, oversaturated, high contrast, cgi, octane render, unreal engine, gloss, bloom",
    width: width,
    height: height,
    public: false,
    numImages: 1,

    // Flux Dev Best Practices
    alchemy: false,
    photoReal: false,
    promptMagic: false,
    enhancePrompt: false,

    // Disable legacy enhancers to keep model pure
    highContrast: false,
    highResolution: false,
    ultra: false,

    // Style and Scheduler
    presetStyle: SdGenerationStyle.General,
    guidanceScale: 3,

    // Miscellaneous
    tiling: false,
    canvasRequest: false,
    transparency: TransparencyType.Disabled,
    unzoom: false,
  };

  return genRequestBody;
}
