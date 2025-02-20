import { type Game } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface GameCardProps {
  game: Game;
}

const fallbackCovers = [
  "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42",
  "https://images.unsplash.com/photo-1594652634010-275456c808d0",
  "https://images.unsplash.com/photo-1540898824226-21f19654dcf1",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420",
  "https://images.unsplash.com/photo-1522069213448-443a614da9b6",
  "https://images.unsplash.com/photo-1511213966740-24d719a0a814",
];

export default function GameCard({ game }: GameCardProps) {
  const coverUrl = game.coverUrl || fallbackCovers[game.id % fallbackCovers.length];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/9]">
        <img
          src={coverUrl}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Platform: {game.platform}</p>
          <p>Purchased: {format(new Date(game.purchaseDate), "PP")}</p>
          {game.releaseDate && (
            <p>Released: {format(new Date(game.releaseDate), "PP")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
