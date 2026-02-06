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
    modelId: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3", // Phoenix 1.0
    sdVersion: SdVersions.Phoenix,
    prompt: prompt,
    width: width,
    height: height,

    // Phoenix 1.0 Best Practices
    alchemy: false,
    photoReal: false,
    promptMagic: false,

    // Disable legacy enhancers to keep model pure
    highContrast: false,
    highResolution: false,
    ultra: false,

    // Style and Scheduler
    presetStyle: SdGenerationStyle.Cinematic,
    scheduler: SdGenerationSchedulers.EulerAncestralDiscrete,
    guidanceScale: 6,
    numInferenceSteps: 40,
    numImages: 1,

    // Miscellaneous
    tiling: false,
    canvasRequest: false,
    enhancePrompt: false,
    transparency: TransparencyType.Disabled,
    unzoom: false,
  };

  return genRequestBody;
}
