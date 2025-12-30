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
import Settings from "@/pages/Settings";
import Legal from "@/pages/Legal";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Disclaimers from "@/pages/Disclaimers";
import Affiliate from "@/pages/Affiliate";
import Safety from "@/pages/Safety";
import Contact from "@/pages/Contact";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { TermsModal } from "@/components/TermsModal";
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
      <Route path="/settings" component={Settings} />
      <Route path="/legal" component={Legal} />
      <Route path="/legal/terms" component={Terms} />
      <Route path="/legal/privacy" component={Privacy} />
      <Route path="/legal/disclaimers" component={Disclaimers} />
      <Route path="/legal/affiliate" component={Affiliate} />
      <Route path="/legal/safety" component={Safety} />
      <Route path="/legal/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <TermsModal />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
