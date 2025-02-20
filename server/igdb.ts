const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

interface IGDBGame {
  id: number;
  name: string;
  cover?: { url: string };
  first_release_date?: number;
  summary?: string;
}

export async function searchGames(query: string): Promise<IGDBGame[]> {
  // Mock IGDB API response for now
  return [
    {
      id: 1,
      name: "The Legend of Zelda: Breath of the Wild",
      cover: {
        url: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42"
      },
      first_release_date: 1488499200,
      summary: "Enter a world of adventure"
    }
  ];
}
