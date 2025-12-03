import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Training from "@/pages/Training";
import Library from "@/pages/Library";
import Progress from "@/pages/Progress";
import Learn from "@/pages/Learn";
import Onboarding from "@/pages/Onboarding";
import Article from "@/pages/Article";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading || !user) return;
    
    // Redirect to onboarding if not completed
    if (!user.hasOnboarded && location !== "/onboarding") {
      setLocation("/onboarding");
    }
  }, [location, setLocation, user, isLoading]);

  // Show simple loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6d45d2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Home} />
      <Route path="/training" component={Training} />
      <Route path="/library" component={Library} />
      <Route path="/progress" component={Progress} />
      <Route path="/learn" component={Learn} />
      <Route path="/article/restoring-smell" component={Article} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
