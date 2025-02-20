import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { searchGames } from "./igdb";

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
    const { q } = req.query;
    if (typeof q !== "string") {
      res.status(400).json({ error: "Query parameter required" });
      return;
    }

    const games = await searchGames(q);
    res.json(games);
  });

  return createServer(app);
}
