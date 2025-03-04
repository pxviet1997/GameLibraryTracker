import { useQuery } from "@tanstack/react-query";
import { type Game } from "@shared/schema";
import GameGrid from "@/components/game-grid";
import Filters from "@/components/filters";
import { useState } from "react";

type SortField = "name" | "purchaseDate" | "releaseDate";
type SortOrder = "asc" | "desc";

export default function Home() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("purchaseDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const filteredGames = games
    .filter((game) => !platform || game.platform === platform)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null values in sorting
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortOrder === "asc" ? 1 : -1;
      if (bValue === null) return sortOrder === "asc" ? -1 : 1;

      // For dates, convert to timestamps for comparison
      if (sortField === "purchaseDate" || sortField === "releaseDate") {
        const aTime = new Date(aValue as string).getTime();
        const bTime = new Date(bValue as string).getTime();
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      }

      // For strings (name)
      return sortOrder === "asc" 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          My Games
        </h1>
      </div>

      <Filters
        platform={platform}
        onPlatformChange={setPlatform}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <GameGrid games={filteredGames} isLoading={isLoading} />
    </div>
  );
}