import Anthropic from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import * as path from "node:path";

import { jsonSchema } from "@/services/AIGen/anthropic/output-schema";

// --- Initialize Anthropic Client ---
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// --- Helper to load system prompt safely ---
function loadSystemPrompt(): string {
  const promptPath = path.resolve(
    process.cwd(),
    "src/services/AIGen/anthropic/system-prompt.txt",
  );
  return fs.readFileSync(promptPath, "utf-8");
}

export async function generateWithClaude(
  randomPrompt: string,
): Promise<Anthropic.Beta.Messages.BetaMessage> {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    temperature: 0.7,
    betas: ["structured-outputs-2025-11-13"],
    system: loadSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Document the following artifact and its story: ${randomPrompt}`,
      },
    ],
    output_format: {
      type: "json_schema",
      schema: jsonSchema,
    },
  });
  return response;
}
