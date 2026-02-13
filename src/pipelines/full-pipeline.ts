import { MadlibsGenerator } from "@/utils/madlibs";
import {
  newArtworkPipeline,
  newStoryPipeline,
} from "@/pipelines/content-generation";
import { leonardoGeneration } from "@/pipelines/image-generation";

export async function fullPipeline() {
  try {
    // --- STEP 1: Madlisb prompt generation ---
    // Initalize Madlibs Generator
    const madlibsGen = new MadlibsGenerator();
    console.log("Generating random prompts using Madlibs...");
    const randomArtworkPrompt = madlibsGen.createArtwork();
    if (!randomArtworkPrompt) {
      throw new Error("Failed to generate artwork prompt");
    }
    console.log("Generated Artwork Prompt:", randomArtworkPrompt);

    const randomStoryPrompt = madlibsGen.createStory();
    if (!randomStoryPrompt) {
      throw new Error("Failed to generate story prompt");
    }
    console.log("Generated Story Prompt:", randomStoryPrompt);

    // --- STEP 2: Obtain artwork description from Claude based on random prompt ---
    console.log("Requesting artwork description from Claude...");
    const artworkDescription = await newArtworkPipeline(randomArtworkPrompt);
    if (!artworkDescription) {
      throw new Error("Failed to obtain artwork description from Claude");
    }
    console.log("Received artwork description from Claude");

    // --- STEP 3: Parallel processing of story and artwork generations ---
    const [story, imageUrl] = await Promise.all([
      newStoryPipeline(randomStoryPrompt),
      leonardoGeneration(artworkDescription),
    ]);

    // --- STEP 4: Store results in database ---
  } catch (error) {
    console.error("❌ Error in pipeline:", error);
    throw error;
  }
}
