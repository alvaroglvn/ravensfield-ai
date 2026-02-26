# 🦉 The Ravensfield Collection

The Ravensfield Collection is a weird, wonderful, and fully AI-generated museum 🔮
Every object and every story in this collection is the result of machine imagination.

🌐 **[Check it live →](https://ravensfieldcollection.com)**

---

## 💡 Why I Built This Project

- 🤖 I'm fascinated by the boundaries between AI and creativity.
- 👻 Frankly, I love making fun, weird stuff.

---

## ⚙️ Tech Stack

**Frontend:** Expo Router v6 with React Native for Web and server-side rendering. I wanted a universal app that renders fast, works on any screen size, and doesn't feel like a blog template. Tamagui handles the UI with full SSR support and a light/dark theme toggle that respects your system preference.

**Backend:** Express.js serving the SSR output and API routes. The Expo Router API routes live right alongside the UI code, which keeps everything tidy.

**AI:**

- Claude API for all things text — artwork descriptions, stories, fake expert quotes, and a vision-based consistency pass after the image is generated.
- Leonardo.AI API for image generation from Claude's own prompts.

**AI Responses Validation** Valibot with custom schemas.

**Database:** Turso with Drizzle ORM. Atomic transactions make sure no half-baked article ever makes it into the collection.

**Deployment:** Fly.io with a bluegreen deployment strategy for zero-downtime updates.

---

## 🧪 How It Works

**1. Madlibs prompt generation**
A `MadlibsGenerator` picks from curated word lists and fills in a template to produce a randomized artwork concept and story prompt. This produces a "controlled chaos" starting point.

**2. Artwork description**
The artwork prompt goes to Claude, which returns a structured JSON response: a description of the object and an image generation prompt. I validate the response against a schema — LLMs can be lazy and skip fields sometimes.

**3. Parallel generation**
Two things happen at the same time:

- Claude takes the artwork description and generates its backstory, including title, SEO description, artwork metadata (type, year, medium, artist), and fake quotes from imaginary experts.
- Leonardo.AI receives Claude's image prompt and generates the artwork image.

**4. Atomic storage**
Once everything is ready, a single database transaction inserts the article, the artwork, and all the quotes together. If anything is missing or malformed, the whole transaction rolls back. No partial data ever hits the collection.

**5. Vision consistency check**
Claude looks at the generated image and the story side by side, and refines the text so the two actually agree with each other. It's a small touch that makes the whole thing feel more intentional.

**6. Rendering the collection**
Once content is in the database, the Expo Router frontend takes over. React Query fetches articles and artwork from the API routes and feeds them into Tamagui components. Everything is server-side rendered on first load for fast delivery, then hydrated on the client for smooth navigation. The result is a real museum experience, not just a list of posts.

---

## 🚀 Deployment

The app is deployed to Fly.io as a single container running the Express server. Bluegreen deployments mean updates go live without downtime. The server exposes a `/healthz` endpoint for health checks and scales down when idle, keeping costs low.

A GitHub Actions cron job fires every day at midnight UTC and triggers the content pipeline automatically — **so the collection grows on its own 🤖 🎨.**

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
