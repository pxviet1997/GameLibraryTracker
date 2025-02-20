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

    // Add sample games
    const sampleGames: InsertGame[] = [
      {
        name: "The Legend of Zelda: Breath of the Wild",
        platform: "Nintendo Switch",
        purchaseDate: new Date("2023-12-25"),
        releaseDate: new Date("2017-03-03"),
        coverUrl: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42",
        description: "An open-world action-adventure game",
        igdbId: null
      },
      {
        name: "God of War Ragnarök",
        platform: "PlayStation 5",
        purchaseDate: new Date("2024-01-15"),
        releaseDate: new Date("2022-11-09"),
        coverUrl: "https://images.unsplash.com/photo-1594652634010-275456c808d0",
        description: "Action-adventure game based on Norse mythology",
        igdbId: null
      },
      {
        name: "Elden Ring",
        platform: "PC",
        purchaseDate: new Date("2023-11-01"),
        releaseDate: new Date("2022-02-25"),
        coverUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
        description: "An action RPG set in a vast open world",
        igdbId: null
      }
    ];

    sampleGames.forEach(game => this.addGame(game));
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async addGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentId++;
    const game: Game = {
      ...insertGame,
      id,
      igdbId: insertGame.igdbId ?? null,
      coverUrl: insertGame.coverUrl ?? null,
      releaseDate: insertGame.releaseDate ?? null,
      description: insertGame.description ?? null
    };
    this.games.set(id, game);
    return game;
  }
}

export const storage = new MemStorage();