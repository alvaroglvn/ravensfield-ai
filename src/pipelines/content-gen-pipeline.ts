import { MadlibsGenerator } from "@/utils/madlibs";
import {
  generateWithClaude,
  parseAnthropicResponse,
  validateAnthropicData,
  OutputSchema,
} from "@/services/AIGen/anthropic";

export async function contentGenPipeline(maxRetries = 3) {
  let attempt = 0;
  let lastError: any;
  while (attempt < maxRetries) {
    try {
      // 1. Create a randomized prompt
      const newPrompt = new MadlibsGenerator().createPrompt();
      if (!newPrompt) {
        throw new Error("Failed to create a randomized prompt");
      }

      // 2. Send the prompt to AI generation service
      const response = await generateWithClaude(newPrompt);
      if (!response) {
        throw new Error("No response from AI generation service");
      }

      // 3. Parse the response
      const parsedData = parseAnthropicResponse(response);
      if (!parsedData) {
        throw new Error("Failed to parse AI response");
      }

      // 4. Validate the parsed data
      const isValid = validateAnthropicData(parsedData, OutputSchema);
      if (!isValid) {
        throw new Error("Validation failed for AI generated data");
      }

      return parsedData;
    } catch (error) {
      attempt++;
      lastError = error;
      console.error(`Attempt ${attempt} failed in generation pipeline:`, error);
      // brief delay before retrying
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
  // After all retries, throw last error
  throw lastError || new Error("Unknown error in generation pipeline");
}
