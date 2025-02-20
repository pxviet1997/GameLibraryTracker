import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { searchGames } from "./igdb";
import { log } from "./vite";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  app.get("/api/games", async (_req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.post("/api/games", async (req, res) => {
    const result = insertGameSchema.safeParse(req.body);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      res.status(400).json({ error: validationError.message });
      return;
    }

    try {
      const game = await storage.addGame(result.data);
      res.json(game);
    } catch (error) {
      console.error('Error adding game:', error);
      res.status(500).json({ error: "Failed to add game" });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid game ID" });
      return;
    }

    try {
      await storage.deleteGame(id);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(404).json({ error: "Game not found" });
    }
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