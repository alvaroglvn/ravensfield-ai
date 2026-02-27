# 🦉 The Ravensfield Collection

The Ravensfield Collection is a **fully AI-generated museum** of the weird and wonderful 🔮.

The collection is powered by an AI storytelling engine that produces unique narratives and artifacts.

The result is presented as a real digital museum with its own internal logic and narrative universe.

🌐 **[Check it live →](https://ravensfieldcollection.com)**

---

## 💡 Why I Built This

- 🤖 I'm fascinated by the boundaries between **AI and creativity**.
- 🧪 I wanted to see how far I could push generative models in a cohesive, intentional project.
- 👻 Frankly, I never just get tired of weird, surreal stories.

The goal was never just to generate content, but to orchestrate an AI generated narrative universe. That meant more complex prompting and validation strategies to focus the output, making it original, coherent, and consistent.

---

## ⚙️ Tech Stack

**Backend:** TypeScript and Expo Router. API routes, server-side logic, and SSR all live in the same codebase. Express.js runs underneath as the server adapter, keeping the setup lean.

**Frontend:** Tamagui for all UI and styling, with full SSR support and a light/dark theme toggle that respects your system preference.

**AI:**

- **Claude API** for artwork descriptions, stories, fake expert quotes, and a vision-based consistency pass after the image is generated.
- **Leonardo.AI** for image generation from Claude's own prompts.

**AI Response Validation:** Valibot with custom schemas.

**Database:** Turso with Drizzle ORM.

**Deployment:** Fly.io with a bluegreen deployment strategy for zero-downtime updates.

---

## 🧪 How It Works

**1. Madlibs prompt generation**
A `MadlibsGenerator` picks from curated word lists and produces a randomized artwork concept and story prompt.

**2. Artwork description**
The artwork prompt goes to Claude, which returns a single validated string: a technical description of the object that will also serve as the image generation prompt for Leonardo. Valibot checks the response before anything moves forward.

**3. Parallel generation**
Two things happen at the same time:

- Claude receives the artwork description alongside the second Madlibs prompt (the story prompt) and generates the full article: title, SEO description, artwork metadata (type, year, medium, artist), and fake quotes from imaginary experts. Valibot checks the response.

- Leonardo.AI receives the artwork description as its image prompt and generates the artwork image.

**4. Database storage**
Once everything is ready, a single database transaction inserts the article, the artwork, and all the quotes together. If anything is missing or malformed, the whole transaction rolls back. No partial data ever hits the collection.

**5. Vision consistency check**
Claude looks at the generated image and the story side by side, and refines the text so the two actually agree with each other. It's a small touch that makes the whole thing feel more intentional.

**6. Rendering the collection**
React Query fetches from the API routes and feeds the content into Tamagui components. They are server-side rendered on first load, then hydrated on the client for smooth navigation.

### Pipeline Overview

```text
       MadlibsGenerator
      (artwork + story prompts)
              │
              ▼
        Claude API [1]
   artwork description + image prompt
       │ Valibot validation
       │
       ├───────────────────────────────┐
       ▼                               ▼
  Claude API [2]                  Leonardo.AI
  story, metadata, quotes         image generation
  │ Valibot validation            │ (returns image URL directly)
       │                               │
       └──────────────┬────────────────┘
                      ▼
           Atomic DB transaction
           (article + artwork + quotes)
                      │
                      ▼
             Claude API [3]
             Vision consistency check
             (reads image + story from DB,
              returns refined text → updates DB)
                      │
                      ▼
             Frontend rendering
             (SSR → React Query → Tamagui)
```

---

## 🚀 Deployment

The app is deployed to Fly.io as a single container. Bluegreen deployments mean updates go live without downtime. The server exposes a `/healthz` endpoint for health checks and scales down when idle, keeping costs low.

A GitHub Actions cron job fires every day at midnight UTC and triggers the content pipeline automatically, so the collection grows on its own 🤖 🎨.

---

## 🔮 What's Next?

A few directions I'd like to take this:

- **Native mobile app** — the codebase already targets React Native, so publishing to iOS and Android is a natural next step
- **Search and filtering** — let visitors dig through the collection by medium, era, or keyword
- **Audio narration** — have an AI voice read each story aloud, proper museum audio guide style
- **Visitor interactions** — leave a note in the guestbook, flag a piece as a favourite, share to social
- **Expanded categories** — the madlibs dictionaries could grow to cover more obscure and strange corners of the art world

---

## 🙏 Acknowledgements

This project is built on the shoulders of some incredible open source work:

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [Tamagui](https://tamagui.dev)
- [TanStack Query](https://tanstack.com/query)
- [Drizzle ORM](https://orm.drizzle.team)
- [Express](https://expressjs.com)
- [Valibot](https://valibot.dev)
- [Zeego](https://zeego.dev)
