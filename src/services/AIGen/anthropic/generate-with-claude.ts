import Anthropic from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import * as path from "node:path";

import { contentSchema } from "@/services/AIGen/anthropic/output-schemas/content-schema";
import { artworkSchema } from "@/services/AIGen/anthropic/output-schemas/artwork-describe-schema";

// --- Initialize Anthropic Client ---
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// --- Helper to load system prompt safely ---
function loadSystemPrompt(filePath: string): string {
  const promptPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(promptPath)) {
    throw new Error(`System prompt file not found at path: ${promptPath}`);
  }
  return fs.readFileSync(promptPath, "utf-8");
}

// --- Function to request artwork description from Claude ---
export async function requestArtworkDescription(
  randomArtworkPrompt: string,
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    thinking: {
      type: "enabled",
      budget_tokens: 2000,
    },
    max_tokens: 2500,
    temperature: 1,
    betas: ["structured-outputs-2025-11-13"],
    system: loadSystemPrompt(
      "src/services/AIGen/anthropic/system/image-describe.txt",
    ),
    messages: [
      {
        role: "user",
        content: `Describe the following artwork in a technical paragraph: ${randomArtworkPrompt} Note: This should be ONE unified implement/object, not multiple separate pieces.`,
      },
    ],
    output_format: {
      type: "json_schema",
      schema: artworkSchema,
    },
  });
  return response;
}

// --- Main function to generate content based on artwork and story prompts ---
export async function requestNewStory(
  artworkPrompt: string,
  storyPrompt: string,
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    thinking: {
      type: "enabled",
      budget_tokens: 3000,
    },
    max_tokens: 5000,
    temperature: 1,
    betas: ["structured-outputs-2025-11-13"],
    system: loadSystemPrompt(
      "src/services/AIGen/anthropic/system/content-describe.txt",
    ),
    messages: [
      {
        role: "user",
        content: `Document the following artwork and its story: ${artworkPrompt} ${storyPrompt}`,
      },
    ],
    output_format: {
      type: "json_schema",
      schema: contentSchema,
    },
  });
  return response;
}

async function visualConsistencyCheck(imageUrl: string, story: string) {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1000,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "url",
              url: imageUrl,
            },
          },
          {
            type: "text",
            text: `Find inconsistencies between the image and its description in this story: ${story} Edit the story to fix any inconsistencies you find, ensuring the story accurately reflects the content of the image. Return the edited story.`,
          },
        ],
      },
    ],
  });
}
