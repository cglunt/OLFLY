import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Clinicians from "@/pages/Clinicians";
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
import CookiePolicy from "@/pages/CookiePolicy";
import Login from "@/pages/Login";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { useEffect } from "react";
import { initializeTrackers } from "@/lib/cookieConsent";

function AppRouter() {
  const [location, setLocation] = useLocation();
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const { user, isLoading } = useCurrentUser(firebaseUser?.displayName || undefined);

  useEffect(() => {
    if (authLoading) return;
    
    if (!firebaseUser && location.startsWith("/launch") && location !== "/launch/login") {
      setLocation("/launch/login");
      return;
    }
    
    if (firebaseUser && location === "/launch/login") {
      setLocation("/launch");
      return;
    }
  }, [authLoading, firebaseUser, location, setLocation]);

  useEffect(() => {
            if (isLoading || !firebaseUser || !user) return;
    
    if (!user.hasOnboarded && location.startsWith("/launch") && location !== "/launch/onboarding" && location !== "/launch/login") {
      setLocation("/launch/onboarding");
    }
  }, [location, setLocation, user, isLoading, firebaseUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6d45d2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!firebaseUser) {
    return <Login />;
  }

    if (isLoading) {52
                    
    return (
      <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6d45d2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/launch/login" component={Login} />
      <Route path="/launch/onboarding" component={Onboarding} />
      <Route path="/launch" component={Home} />
      <Route path="/launch/training" component={Training} />
      <Route path="/launch/library" component={Library} />
      <Route path="/launch/progress" component={Progress} />
      <Route path="/launch/learn" component={Learn} />
      <Route path="/launch/article/restoring-smell" component={Article} />
      <Route path="/launch/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [location] = useLocation();

  const isAppRoute = location.startsWith("/launch");
  const isLegalRoute = location.startsWith("/legal");

  if (isAppRoute) {
    return <AppRouter />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/clinicians" component={Clinicians} />
      <Route path="/legal" component={Legal} />
      <Route path="/legal/terms" component={Terms} />
      <Route path="/legal/privacy" component={Privacy} />
      <Route path="/legal/disclaimers" component={Disclaimers} />
      <Route path="/legal/affiliate" component={Affiliate} />
      <Route path="/legal/safety" component={Safety} />
      <Route path="/legal/contact" component={Contact} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/pricing" component={Landing} />
      {!isLegalRoute && <Route component={NotFound} />}
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeTrackers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CookieConsentBanner />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
