import * as v from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";

// --- 1. VALIBOT SCHEMA DEFINITION ---

const ArtworkSchema = v.strictObject({
  title: v.pipe(
    v.string(),
    v.minLength(2, "Title cannot be empty"),
    v.maxLength(70, "Title cannot exceed 70 characters"),
  ),
  year: v.pipe(
    v.string(),
    v.maxLength(40, "Keep the date labels concise"),
    v.description(
      "The date text as seen on a museum tag. e.g., 'c. 1450', '3000 BC', '1920-1925', 'Unknown'",
    ),
  ),
  type: v.pipe(
    v.string(),
    v.picklist(
      [
        "Painting",
        "Sculpture",
        "Drawing",
        "Photograph",
        "Object d'art",
        "Archeological Find",
      ],
      "Must be  a standard artwork type",
    ),
  ),
  medium: v.pipe(
    v.string(),
    v.maxLength(120, "Medium description must be concise"),
  ),
  artist: v.pipe(v.string(), v.maxLength(100, "Artist name must be concise")),
  imagePrompt: v.pipe(
    v.string(),
    v.minLength(100),
    v.maxLength(1600),
    v.description(
      "A structured, keyword-dense prompt optimized for Leonardo.ai to generate photorealistic museum artifacts. " +
        "MANDATORY FORMAT: [Subject], [Specific Medium & Materiality], [Era/Style], [Lighting & Atmosphere], [Camera & Texture Keywords]. " +
        "CRITICAL INSTRUCTIONS: " +
        "1. Focus on IMPERFECTIONS: Use words like 'patina', 'craquelure', 'chipped marble', 'oxidized bronze', 'dusty', 'worn edges', 'visible brushstrokes', 'heavy impasto'. " +
        "2. LIGHTING: Use 'dramatic museum spotlight', 'chiaroscuro', 'volumetric lighting', or 'dark background' to simulate a curator's photo. " +
        "3. TECHNICAL: Include 'macro photography', '8k resolution', 'highly detailed', 'subsurface scattering' (for marble/skin), 'sharp focus'. " +
        "4. Do NOT use conversational grammar (e.g. 'Show me a...'). Use comma-separated descriptors.",
    ),
  ),
});

const QuoteSchema = v.strictObject({
  content: v.pipe(
    v.string(),
    v.minLength(15),
    v.maxLength(300, "Keep quotes impactful and concise"),
    v.description(
      "A dramatic, opinionated, or poetic remark about the artwork. " +
        "It should capture the emotional impact of the piece (e.g., haunting, revolutionary, scandalous). " +
        "Avoid generic praise.",
    ),
  ),
  author: v.pipe(
    v.string(),
    v.maxLength(140, "Author attribution must be concise"),
    v.description(
      "The fictional persona attributing the quote. " +
        "Include a name and optional title/role to add flavor. " +
        "Examples: 'Honoria Nightcreeper', 'Henri, Compte de Varnish', 'Review in The London Times (1892)'",
    ),
  ),
});

const ArticleSchema = v.strictObject({
  _planning: v.pipe(
    v.string(),
    v.description(
      "Analyze the artifact's era. Outline the 10-paragraph arc, specifically the Twist in paragraph 8, before writing.",
    ),
  ),
  title: v.pipe(
    v.string(),
    v.minLength(5, "Title cannot be empty"),
    v.maxLength(60, "Title must be under 60 characters"),
    v.description(
      "A short, mysterious title. e.g. 'The Silent Bell', 'Gillespie's Folly'.",
    ),
  ),
  seoDescription: v.pipe(
    v.string(),
    v.maxLength(240, "SEO description cannot exceed 240 characters"),
    v.minLength(50, "SEO description is too short"),
    v.description(
      "A punchy, click-worthy summary for Google search results. " +
        "Include the artifact name and the word 'Uncanny'. " +
        "Do not use the passive voice.",
    ),
  ),
  content: v.pipe(
    v.string(),
    v.minLength(1800, "Story must be at least 350 words"),
    v.maxLength(9000, "Story cannot exceed 9000 characters"),
    v.description(
      "A 10-paragraph flash fiction story. " +
        "Tone: Elevated, eerie, museum-curator style. " +
        "Structure: Para 1 (Intro) to Para 10 (Reflection). " +
        "Follow the 'Story Structure' guidelines in the system prompt precisely.",
    ),
  ),
  artwork: ArtworkSchema,
  quotes: v.array(QuoteSchema),
});

export const OutputSchema = v.strictObject({
  items: v.array(ArticleSchema),
});

export type OutputSchemaType = v.InferOutput<typeof OutputSchema>;

// --- 2. RAW JSON SCHEMA (For Anthropic API) ---
// Generated from Valibot schema to ensure consistency.
export const jsonSchema = toJsonSchema(OutputSchema, {
  typeMode: "output",
}) as {
  [key: string]: unknown;
};
