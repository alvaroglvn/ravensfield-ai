import * as v from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";

const artworkDescribeSchema = v.strictObject({
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

export const artworkOutputSchema = v.strictObject({
  items: v.array(artworkDescribeSchema),
});

export type ArtworkSchemaType = v.InferOutput<typeof artworkOutputSchema>;

export const artworkSchema = toJsonSchema(artworkOutputSchema, {
  typeMode: "output",
}) as {
  [key: string]: unknown;
};
