import { contentGenPipeline } from "@/pipelines/content-gen-pipeline";
import { storeGeneratedData } from "@/pipelines/store-data-pipeline";
import { imageGenPipeline } from "@/pipelines/image-gen-pipeline";

export async function articleCreationPipeline() {
  try {
    console.log("🚀 Starting Article Creation Pipeline...");

    // --- 1. GENERATE NEW CONTENT ---\n
    const generatedData = await contentGenPipeline();
    if (!generatedData) {
      throw new Error("Content generation failed (returned null).");
    }
    console.log(`✅ Content Generated: "${generatedData.items[0].title}"`);

    // --- 2. STORE GENERATED DATA ---\n
    const artworkId = await storeGeneratedData(generatedData);

    // SAFETY CHECK: Did we actually get an ID?
    if (!artworkId) {
      throw new Error(
        "❌ CRITICAL: storeGeneratedData returned no ID. Cannot generate image.",
      );
    }
    console.log(`✅ Data Stored. Artwork ID: ${artworkId}`);

    const imagePrompt = generatedData.items[0].artwork.imagePrompt;

    // --- 3. GENERATE IMAGE ---\n
    console.log("🎨 Starting Image Generation...");
    await imageGenPipeline(imagePrompt, artworkId);
    console.log("✅ Pipeline Complete!");
  } catch (error) {
    console.error("❌ Error in article creation pipeline:", error);
    throw error;
  }
}
