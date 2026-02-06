import Anthropic from "@anthropic-ai/sdk";
import * as v from "valibot";

import { OutputSchemaType } from "@/services/AIGen/anthropic/output-schema";

export function parseAnthropicResponse(
  response: Anthropic.Beta.Messages.BetaMessage,
): OutputSchemaType {
  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error(
      `Unexpected response content type: expected 'text', got '${block.type}'`,
    );
  }

  try {
    const parsedData = JSON.parse(block.text);
    return parsedData as OutputSchemaType;
  } catch (error) {
    throw new Error(`Failed to parse JSON from Anthropic response: ${error}`);
  }
}

export function validateAnthropicData(
  parsedData: any,
  schema: v.BaseSchema<any, any, any>,
): boolean {
  const result = v.safeParse(schema, parsedData);

  if (!result.success) {
    console.error(
      "❌ Validation Failed:",
      JSON.stringify(v.flatten(result.issues), null, 2),
    );
    return false;
  }

  return true;
}
