import Anthropic from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import * as path from "node:path";

import { contentSchema } from "@/services/AIGen/anthropic/output-schemas/content-schema";
import { ImagePromptJsonSchema } from "@/services/AIGen/anthropic/output-schemas/image-prompt-schema";

// --- Initialize Anthropic Client ---
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// --- Helper to load system prompt safely ---
function loadContentSystemPrompt(): string {
  const promptPath = path.resolve(
    process.cwd(),
    "src/services/AIGen/anthropic/system/content-describe.txt",
  );
  return fs.readFileSync(promptPath, "utf-8");
}

export async function generateContent(
  artifactPrompt: string,
  storyPrompt: string,
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    thinking: {
      type: "enabled",
      budget_tokens: 3000,
    },
    max_tokens: 2000,
    temperature: 1,
    betas: ["structured-outputs-2025-11-13"],
    system: loadContentSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Document the following artifact and its story: ${artifactPrompt} ${storyPrompt}`,
      },
    ],
    output_format: {
      type: "json_schema",
      schema: contentSchema,
    },
  });
  return response;
}

// --- New function to generate image description prompts ---

function loadImageDescribeSystem(): string {
  const promptPath = path.resolve(
    process.cwd(),
    "src/services/AIGen/anthropic/system/image-describe.txt",
  );
  return fs.readFileSync(promptPath, "utf-8");
}

export async function generateArtifact(
  randomArtwork: string,
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    thinking: {
      type: "enabled",
      budget_tokens: 2000,
    },
    max_tokens: 300,
    temperature: 0.8,
    betas: ["structured-outputs-2025-11-13"],
    system: loadImageDescribeSystem(),
    messages: [
      {
        role: "user",
        content: `Describe the following artwork in a technical paragraph: ${randomArtwork}`,
      },
    ],
    output_format: {
      type: "json_schema",
      schema: ImagePromptJsonSchema,
    },
  });
  return response;
}
