import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { searchGames } from "./igdb";
import { log } from "./vite";

export async function registerRoutes(app: Express) {
  app.get("/api/games", async (_req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.post("/api/games", async (req, res) => {
    const result = insertGameSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid game data" });
      return;
    }

    const game = await storage.addGame(result.data);
    res.json(game);
  });

  app.get("/api/igdb/search", async (req, res) => {
    const query = req.query.q;
    if (typeof query !== "string" || query.length < 2) {
      res.status(400).json({ error: "Query parameter must be a string with at least 2 characters" });
      return;
    }

    try {
      log(`Searching IGDB for: ${query}`);
      const games = await searchGames(query);
      log(`Found ${games.length} games for query: ${query}`);
      res.json(games);
    } catch (error) {
      console.error("IGDB search error:", error);
      res.status(500).json({ error: "Failed to search games" });
    }
  });

  return createServer(app);
}