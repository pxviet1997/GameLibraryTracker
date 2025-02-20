import axios from "axios";

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

interface IGDBGame {
  id: number;
  name: string;
  cover?: { url: string };
  first_release_date?: number;
  summary?: string;
}

async function getAccessToken() {
  if (accessToken && tokenExpiry && tokenExpiry > new Date()) {
    return accessToken;
  }

  const response = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`
  );

  accessToken = response.data.access_token;
  tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
  return accessToken;
}

export async function searchGames(query: string): Promise<IGDBGame[]> {
  const token = await getAccessToken();

  const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `search "${query}";
     fields name,cover.url,first_release_date,summary;
     limit 5;
     where version_parent = null;`,
    {
      headers: {
        'Client-ID': IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.data.map((game: any) => ({
    id: game.id,
    name: game.name,
    cover: game.cover ? {
      url: game.cover.url.replace('t_thumb', 't_cover_big')
    } : undefined,
    first_release_date: game.first_release_date,
    summary: game.summary,
  }));
}