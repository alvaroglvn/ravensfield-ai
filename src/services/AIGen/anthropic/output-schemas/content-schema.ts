import * as v from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";

const ArtworkSchema = v.strictObject({
  title: v.pipe(
    v.string(),
    v.minLength(2),
    v.maxLength(70),
    v.description(
      "Artifact title. Follow naming conventions from system instructions.",
    ),
  ),
  year: v.pipe(
    v.string(),
    v.maxLength(40),
    v.description(
      "Date as displayed on museum tag (e.g., 'c. 1450', 'Unknown').",
    ),
  ),
  type: v.pipe(
    v.string(),
    v.picklist([
      "Painting",
      "Sculpture",
      "Drawing",
      "Photograph",
      "Object d'art",
      "Archeological Find",
    ]),
  ),
  medium: v.pipe(v.string(), v.maxLength(120)),
  artist: v.pipe(v.string(), v.maxLength(100)),
});

const QuoteSchema = v.strictObject({
  content: v.pipe(
    v.string(),
    v.minLength(10),
    v.maxLength(200),
    v.description("Quote about the artifact (under 20 words)."),
  ),
  author: v.pipe(
    v.string(),
    v.maxLength(200),
    v.description("Attribution with name and optional role."),
  ),
});

const ArticleSchema = v.strictObject({
  title: v.pipe(
    v.string(),
    v.minLength(5),
    v.maxLength(60),
    v.description("Article title (short and mysterious)."),
  ),
  seoDescription: v.pipe(
    v.string(),
    v.minLength(50),
    v.maxLength(160),
    v.description("SEO meta description. Active voice."),
  ),
  content: v.pipe(
    v.string(),
    v.minLength(1800),
    v.maxLength(4500),
    v.description(
      "5-paragraph story (under 600 words). " +
        "Embed provided technical paragraph as paragraph 2. " +
        "Follow narrative structure from system instructions.",
    ),
  ),
  artwork: ArtworkSchema,
  quotes: v.array(QuoteSchema),
});

export const contentOutputSchema = v.strictObject({
  items: v.array(ArticleSchema),
});

export type ContentSchemaType = v.InferOutput<typeof contentOutputSchema>;

export const contentSchema = toJsonSchema(contentOutputSchema, {
  typeMode: "output",
}) as {
  [key: string]: unknown;
};
