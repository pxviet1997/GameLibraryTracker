import { type Game } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const coverUrl = game.coverUrl || fallbackCovers[game.id % fallbackCovers.length];

  const { mutate: deleteGame, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/games/${game.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "Game deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete game",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
        <div className="flex justify-between items-start">
          <CardTitle>{game.name}</CardTitle>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => deleteGame()}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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