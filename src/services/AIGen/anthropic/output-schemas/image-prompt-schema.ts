import * as v from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";

const ImagePromptSchema = v.strictObject({
  imagePrompt: v.pipe(
    v.string(),
    v.minLength(80),
    v.maxLength(150),
    v.description(
      "Conservation documentation paragraph (80-120 words) in present-tense clinical voice. " +
        "Describes material, scale, surface condition, prominent feature, and photography methodology. " +
        "Follow the technical paragraph formula from system instructions.",
    ),
  ),
});

export const OutputSchema = v.strictObject({
  items: v.array(ImagePromptSchema),
});

export type OutputSchemaType = v.InferOutput<typeof OutputSchema>;

export const ImagePromptJsonSchema = toJsonSchema(OutputSchema, {
  typeMode: "output",
}) as {
  [key: string]: unknown;
};
