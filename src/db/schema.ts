import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. ARTICLES
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  seoDescription: text("seo_description"),
  content: text("content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// 2. ARTWORKS (The "Object")
export const artworks = sqliteTable("artworks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" })
    .unique(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  type: text("type").notNull(),
  medium: text("medium").notNull(),
  artist: text("artist").notNull(),
  imagePrompt: text("image_prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// 3. QUOTES
export const quotes = sqliteTable("quotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  author: text("author").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

// 4. RELATIONS

export const articlesRelations = relations(articles, ({ one, many }) => ({
  artwork: one(artworks),
  quotes: many(quotes),
}));

export const artworksRelations = relations(artworks, ({ one }) => ({
  article: one(articles, {
    fields: [artworks.articleId],
    references: [articles.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  article: one(articles, {
    fields: [quotes.articleId],
    references: [articles.id],
  }),
}));
