import { MadlibsGenerator } from "@/utils/madlibs";
import {
  newArtworkPipeline,
  newStoryPipeline,
} from "@/pipelines/content-generation";
import { leonardoGeneration } from "@/pipelines/image-generation";
import { visionConsistencyCheck } from "@/pipelines/vision-checker";
import { storeAll } from "@/pipelines/data-storage";
import type {
  ArticleData,
  ArtworkData,
  QuoteData,
} from "@/pipelines/data-storage";

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
      newStoryPipeline(artworkDescription, randomStoryPrompt),
      leonardoGeneration(artworkDescription),
    ]);

    if (!story) {
      throw new Error("Story generation failed — aborting before any DB write");
    }

    // --- STEP 4: Store all results atomically ---
    const item = story.items[0];
    const newArticle: ArticleData = {
      title: item.title,
      seoDescription: item.seoDescription,
      content: item.content,
    };
    const newArtwork: Omit<ArtworkData, "articleId"> = {
      title: item.artwork.title,
      year: item.artwork.year,
      type: item.artwork.type,
      medium: item.artwork.medium,
      artist: item.artwork.artist,
      imagePrompt: artworkDescription,
      imageUrl: imageUrl || "",
    };
    const newQuotes: QuoteData[] = item.quotes;

    const articleId = await storeAll(newArticle, newArtwork, newQuotes);
    console.log("Stored article, artwork, and quotes with article ID:", articleId);

    // --- STEP 5: Vision consistency check ---
    console.log("Starting vision consistency check...");
    await visionConsistencyCheck(articleId);

    console.log("Pipeline completed successfully!");
  } catch (error) {
    console.error("❌ Error in pipeline:", error);
    throw error;
  }
}
