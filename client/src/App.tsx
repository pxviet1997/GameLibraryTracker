import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import AddGame from "@/pages/add-game";
import NotFound from "@/pages/not-found";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

function Navigation() {
  return (
    <NavigationMenu className='max-w-screen-xl mx-auto px-4 py-6'>
      <NavigationMenuList className='flex gap-5'>
        <NavigationMenuItem>
          <Link href='/'>
            <span
              className={cn(
                "text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent cursor-pointer"
              )}
            >
              GameVault
            </span>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href='/add'>
            <span className='cursor-pointer'>Add Game</span>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='min-h-screen bg-background'>
        <Navigation />
        <main className='max-w-screen-xl mx-auto px-4 py-8'>
          <Switch>
            <Route path='/' component={Home} />
            <Route path='/add' component={AddGame} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
