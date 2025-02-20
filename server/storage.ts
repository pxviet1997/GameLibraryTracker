import { games, type Game, type InsertGame } from "@shared/schema";

export interface IStorage {
  getGames(): Promise<Game[]>;
  addGame(game: InsertGame): Promise<Game>;
}

export class MemStorage implements IStorage {
  private games: Map<number, Game>;
  private currentId: number;

  constructor() {
    this.games = new Map();
    this.currentId = 1;
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async addGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentId++;
    const game: Game = { ...insertGame, id };
    this.games.set(id, game);
    return game;
  }
}

export const storage = new MemStorage();
