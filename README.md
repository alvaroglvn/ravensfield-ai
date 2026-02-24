# Ravensfield AI

A cross-platform content-generation app that produces fictional museum articles and images using AI, stores them in an edge SQLite database, and serves a Tamagui-powered frontend (web + mobile via Expo).

## What the project is

- **Type:** Cross-platform Expo + Tamagui application with serverless API routes.
- **DB:** Edge SQLite (Turso) accessed via HTTP and Drizzle schema definitions.
- **AI:** Anthropic Claude for structured text generation; Leonardo for image generation parameters.

## What it does

- **Generates** fictional museum articles (structured text) using AI prompts and validation schemas.
- **Validates** AI outputs against JSON schemas before persisting.
- **Requests** images via a Leonardo image pipeline (parameter preparation included).
- **Persists** generated content in an edge DB and exposes API routes for feed and single-article retrieval.
- **Renders** feed and article pages with Tamagui components for web and mobile.

## Architecture (concise)

- **Input:** Madlibs / randomized prompt generator produces prompts.
- **Text generation:** Anthropic Claude produces structured content controlled by a system prompt and an output schema.
- **Validation:** Output is parsed and validated; only valid items continue.
- **Storage:** Validated items are persisted to Turso via Drizzle/HTTP helper methods.
- **Image generation:** Image parameter generation pipeline prepares requests for Leonardo (Flux) model.
- **Frontend:** Tamagui + Expo UI consumes API routes to show feeds and article pages.

High-level flow: prompt → Claude (structured output) → validate → store → (optional) image-gen → serve via API → UI.

## Key files

- **Configuration:** [app.config.ts](app.config.ts), [tamagui.config.ts](tamagui.config.ts), [drizzle.config.ts](drizzle.config.ts)
- **DB:** [src/db/schema.ts](src/db/schema.ts), [src/db/index.ts](src/db/index.ts)
- **AI services:** [src/services/AIGen/anthropic/generate-with-claude.ts](src/services/AIGen/anthropic/generate-with-claude.ts), [src/services/AIGen/leonardo/set-parameters.ts](src/services/AIGen/leonardo/set-parameters.ts)
- **Pipelines / Orchestration:** [src/pipelines/full-pipeline.ts](src/pipelines/full-pipeline.ts), [src/pipelines/content-generation.ts](src/pipelines/content-generation.ts), [src/pipelines/image-generation.ts](src/pipelines/image-generation.ts)
- **API routes:** [src/app/api/feed+api.ts](src/app/api/feed+api.ts), [src/app/api/article/\[slug\]+api.ts](src/app/api/article/[slug]+api.ts)
- **Frontend entry & pages:** [src/app/index.tsx](src/app/index.tsx), [src/app/articles/\[slug\].tsx](src/app/articles/[slug].tsx)
- **UI components:** [src/components/ContentCard.tsx](src/components/ContentCard.tsx), [src/components/Article.tsx](src/components/Article.tsx)

> Note: If a listed file path doesn't exist exactly, check nearby pipeline filenames under `src/pipelines` and `src/services/AIGen` (this README lists the conceptual locations).

### Architecture Diagram

```mermaid
flowchart LR
  A[Madlibs / Prompt Generator] --> B[Anthropic Claude\n(structured output)]
  B --> C[Validator (JSON Schema)]
  C -->|valid| D[Store (Turso via Drizzle/HTTP)]
  C -->|invalid| E[Discard / Log]
  D --> F[Image Pipeline\n(Leonardo parameterizer)]
  F --> G[Leonardo Image Service]
  D --> H[API Routes\n/src/app/api/*]
  H --> I[Frontend (Tamagui + Expo)\n/src/app/* & components]
  G --> I
  subgraph Services
    B
    F
    G
  end
  subgraph DB
    D
  end
  subgraph Frontend
    H
    I
  end
```

## Tech stack

- Expo + React Native + Tamagui (UI)
- TypeScript
- Anthropic Claude (text generation)
- Leonardo (image generation parameters)
- Turso (edge SQLite) + Drizzle for schema
- PNPM for package management

## Quick start (developer)

1. Install dependencies:

```bash
pnpm install
```

1. Build Tamagui CSS (project uses a CSS build step):

```bash
pnpm css
```

1. Start local development (Expo / web):

```bash
pnpm dev
# or: expo start
```

Adjust commands to your local scripts if different.

## Contributing

- Open issues or PRs for bugs and feature work.
- Keep AI prompts, schemas, and pipelines separated — validation-first approach helps avoid bad content.

If you want, I can also add a small architecture diagram, expand the run instructions, or create a CONTRIBUTING.md.

## Complexity & Novel solutions

- **AI output validation (schema-first):** Uses structured system prompts + JSON Schema validation to enforce safe, consistent AI outputs before persisting or downstream use — reduces hallucination and makes outputs machine-consumable.
- **Edge DB via HTTP / Drizzle adapter:** Persists to Turso using HTTP helpers and Drizzle schemas rather than a native client, enabling safe use from Expo serverless routes and edge runtimes.
- **Modular pipeline orchestration:** Pipelines under `src/pipelines` compose generation, validation, storage and image-parameterization steps as discrete, testable units for retries and observability.
- **Image parameterizer for generative models:** Encodes deterministic parameter strategies for Leonardo/Flux so image requests are reproducible and tuned to article metadata.
- **Frontend + backend in one monorepo:** Uses Expo Router server routes and Tamagui UI to serve both mobile/web while keeping backend logic lightweight and edge-friendly.
- **Bundling-aware architecture:** Metro and build configs avoid native-only DB libs and favor HTTP integrations so the app bundles cleanly for Expo environments.
