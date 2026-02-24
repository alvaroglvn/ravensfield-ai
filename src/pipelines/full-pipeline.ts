import { MadlibsGenerator } from "@/utils/madlibs";
import {
  newArtworkPipeline,
  newStoryPipeline,
} from "@/pipelines/content-generation";
import { leonardoGeneration } from "@/pipelines/image-generation";
import { visionConsistencyCheck } from "@/pipelines/vision-checker";
import {
  storeArticle,
  storeArtwork,
  storeQuote,
} from "@/pipelines/data-storage";
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

    // --- STEP 4: Store results in database ---
    const newArticle: ArticleData = {
      title: story ? story.items[0].title : "Untitled Story",
      seoDescription: story ? story.items[0].seoDescription : "",
      content: story ? story.items[0].content : "",
    };
    const articleId = await storeArticle(newArticle);
    if (!articleId) {
      throw new Error("Failed to store article in database");
    }
    console.log("Stored article in database with ID:", articleId);

    const newArtwork: ArtworkData = {
      articleId: articleId,
      title: story ? story.items[0].artwork.title : "Untitled Artwork",
      year: story ? story.items[0].artwork.year : "Unknown Year",
      type: story ? story.items[0].artwork.type : "Unknown Type",
      medium: story ? story.items[0].artwork.medium : "Unknown Medium",
      artist: story ? story.items[0].artwork.artist : "Unknown Artist",
      imagePrompt: artworkDescription,
      imageUrl: imageUrl || "",
    };
    await storeArtwork(newArtwork);
    console.log("Stored artwork in database linked to article ID:", articleId);

    const newQuotes: QuoteData[] = story ? story.items[0].quotes : [];
    for (const quote of newQuotes) {
      await storeQuote(articleId, quote);
      console.log("Stored quote in database linked to article ID:", articleId);
    }

    // --- STEP 5: Vision consistency check ---
    console.log("Starting vision consistency check...");
    await visionConsistencyCheck(articleId);

    console.log("Pipeline completed successfully!");
  } catch (error) {
    console.error("❌ Error in pipeline:", error);
    throw error;
  }
}
