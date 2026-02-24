import Anthropic from "@anthropic-ai/sdk";
import * as v from "valibot";

import type { ContentSchemaType } from "@/services/AIGen/anthropic/output-schemas/content-schema";
import type { ArtworkSchemaType } from "@/services/AIGen/anthropic/output-schemas/artwork-describe-schema";

export function parseClaudeResponse(
  response: Anthropic.Beta.Messages.BetaMessage,
): ArtworkSchemaType | ContentSchemaType {
  if (!response) {
    throw new Error("No response provided from Anthropic");
  }
  let rawText: string | undefined;
  // Try array-style content
  const anyResp: any = response as any;
  if (Array.isArray(anyResp.content) && anyResp.content.length > 0) {
    const block = anyResp.content.find((b: any) => b && (b.text || b.content));
    rawText = block?.text ?? block?.content ?? undefined;
  } else if (typeof anyResp.content === "string") {
    rawText = anyResp.content;
  } else if (typeof anyResp === "string") {
    rawText = anyResp;
  }

  if (!rawText) {
    throw new Error("Could not locate text payload in Anthropic response");
  }

  try {
    const parsedData = JSON.parse(rawText);
    return parsedData as ArtworkSchemaType | ContentSchemaType;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON from Anthropic response text: ${String(error)}\nrawText:${rawText.slice(0, 400)}`,
    );
  }
}

export function validateClaudeData(
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
