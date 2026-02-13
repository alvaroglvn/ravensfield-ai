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
    console.log("Requesting artwork description from Claude...");
    const claudeResponse = await requestArtworkDescription(randomPrompt);
    if (!claudeResponse) {
      throw new Error("Failed to get response from Claude");
    }
    console.log("Received artwork description from Claude");

    // --- Parse response ---
    const parsedDescription = parseClaudeResponse(
      claudeResponse,
    ) as ArtworkSchemaType;
    if (!parsedDescription) {
      throw new Error("Parsed description is invalid or not a string");
    }
    console.log("Parsed Artwork Description");

    // --- Validate response ---
    const isValid = validateClaudeData(parsedDescription, artworkOutputSchema);
    if (!isValid) {
      throw new Error("Validation failed for parsed description");
    }
    console.log("Validated Artwork Description");

    return parsedDescription.items[0].imagePrompt;
  } catch (error) {
    console.error("Error in new artwork pipeline:", error);
  }
}

export async function newStoryPipeline(
  artworkDescription: string,
): Promise<void> {
  try {
    // --- Generate random story prompt using Madlibs ---
    console.log("Generating random story prompt using Madlibs...");
    const randomStoryPrompt = madlibsGen.createStory();
    if (!randomStoryPrompt) {
      throw new Error("Failed to generate story prompt");
    }
    console.log("Generated Story Prompt:", randomStoryPrompt);

    // --- Request new story from Claude based on artwork description and random story prompt ---
    console.log("Requesting new story from Claude...");
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
    console.log("Parsed Story");

    // --- Validate response ---
    const isValid = validateClaudeData(parsedStory, contentOutputSchema);
    if (!isValid) {
      throw new Error("Validation failed for parsed story");
    }
  } catch (error) {
    console.error("Error in new story pipeline:", error);
  }
}
