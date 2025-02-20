import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertGameSchema, type InsertGame, platformOptions } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IGDBGame {
  id: number;
  name: string;
  cover?: { url: string };
  first_release_date?: number;
  summary?: string;
}

// Helper function to detect platform based on IGDB data
function detectPlatform(game: IGDBGame): string {
  // For now, default to PC as we don't have platform data from IGDB
  // You could enhance this by adding platform data to the IGDB query
  return platformOptions[0];
}

export default function AddGame() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<IGDBGame | null>(null);

  const form = useForm<InsertGame>({
    resolver: zodResolver(insertGameSchema),
    defaultValues: {
      name: "",
      platform: platformOptions[0],
      purchaseDate: new Date(),
      releaseDate: null,
      coverUrl: null,
      description: null,
      igdbId: null,
    },
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<IGDBGame[]>({
    queryKey: ["/api/igdb/search", search],
    queryFn: async () => {
      if (search.length < 3) return [];
      const res = await fetch(`/api/igdb/search?q=${encodeURIComponent(search)}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to search games");
      }
      return res.json();
    },
    enabled: search.length >= 3,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InsertGame) => {
      const formattedData = {
        ...data,
        name: data.name.trim(),
        platform: data.platform,
        purchaseDate: data.purchaseDate,
        releaseDate: data.releaseDate,
        igdbId: data.igdbId ?? null,
        coverUrl: data.coverUrl ?? null,
        description: data.description ?? null
      };
      const res = await apiRequest("POST", "/api/games", formattedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "Game added successfully" });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add game", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleGameSelect = (game: IGDBGame) => {
    setSelectedGame(game);
    setSearch("");

    // Set form values
    form.setValue("name", game.name);
    form.setValue("platform", detectPlatform(game));

    if (game.first_release_date) {
      form.setValue("releaseDate", new Date(game.first_release_date * 1000));
    }
    if (game.cover?.url) {
      form.setValue("coverUrl", game.cover.url);
    }
    if (game.summary) {
      form.setValue("description", game.summary);
    }
    form.setValue("igdbId", game.id);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Add New Game
      </h1>

      <div className="relative">
        <Input
          placeholder="Search for a game..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        {search.length > 2 && (
          <Card className="absolute w-full mt-1 z-50">
            <CardContent className="p-2">
              <ScrollArea className="h-[300px]">
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-4 p-2 hover:bg-accent cursor-pointer rounded-lg"
                      onClick={() => handleGameSelect(game)}
                    >
                      {game.cover && (
                        <img
                          src={game.cover.url}
                          alt={game.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{game.name}</h3>
                        {game.first_release_date && (
                          <p className="text-sm text-muted-foreground">
                            Released: {new Date(game.first_release_date * 1000).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-4 text-muted-foreground">No games found</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Game'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}