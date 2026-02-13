import { MadlibsGenerator } from "@/utils/madlibs";
import {
  requestArtworkDescription,
  requestNewStory,
  parseClaudeResponse,
  validateClaudeData,
  ArtworkSchemaType,
  artworkOutputSchema,
  ContentSchemaType,
  contentOutputSchema,
} from "@/services/AIGen/anthropic";

// Initiatilize Madlibs Generator
const madlibsGen = new MadlibsGenerator();

export async function newArtworkPipeline(
  randomPrompt: string,
): Promise<string | void> {
  try {
    // --- Request artwork description from Claude based on random prompt ---
    const claudeResponse = await requestArtworkDescription(randomPrompt);
    if (!claudeResponse) {
      throw new Error("Failed to get response from Claude");
    }

    // --- Parse response ---
    const parsedDescription = parseClaudeResponse(
      claudeResponse,
    ) as ArtworkSchemaType;
    if (!parsedDescription) {
      throw new Error("Parsed description is invalid or not a string");
    }

    // --- Validate response ---
    const isValid = validateClaudeData(parsedDescription, artworkOutputSchema);
    if (!isValid) {
      throw new Error("Validation failed for parsed description");
    }

    return parsedDescription.items[0].imagePrompt;
  } catch (error) {
    console.error("Error in new artwork pipeline:", error);
  }
}

export async function newStoryPipeline(
  artworkDescription: string,
  randomStoryPrompt: string,
): Promise<ContentSchemaType | void> {
  try {
    // --- Request new story from Claude based on artwork description and random story prompt ---
    const claudeStoryResponse = await requestNewStory(
      artworkDescription,
      randomStoryPrompt,
    );

    // --- Parse response ---
    const parsedStory = parseClaudeResponse(
      claudeStoryResponse,
    ) as ContentSchemaType;
    if (!parsedStory) {
      throw new Error("Failed to parse story response");
    }

    // --- Validate response ---
    const isValid = validateClaudeData(parsedStory, contentOutputSchema);
    if (!isValid) {
      throw new Error("Validation failed for parsed story");
    }
    return parsedStory;
  } catch (error) {
    console.error("Error in new story pipeline:", error);
  }
}
