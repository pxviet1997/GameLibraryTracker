import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  igdbId: integer("igdb_id"),
  coverUrl: text("cover_url"),
  releaseDate: timestamp("release_date"),
  purchaseDate: timestamp("purchase_date").notNull(),
  platform: text("platform").notNull(),
  description: text("description"),
});

export const insertGameSchema = createInsertSchema(games, {
  name: z.string().min(1, "Name is required"),
  platform: z.string().min(1, "Platform is required"),
  purchaseDate: z.date(),
  releaseDate: z.date().nullable(),
  igdbId: z.number().nullable(),
  coverUrl: z.string().nullable(),
  description: z.string().nullable(),
}).omit({ id: true });

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export const platformOptions = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X/S",
  "Xbox One",
  "Nintendo Switch",
] as const;