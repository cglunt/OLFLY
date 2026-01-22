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
import { useAuth } from "@/lib/useAuth";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect } from "react";
import { initializeTrackers } from "@/lib/cookieConsent";

function AppRouter() {
  const { user: firebaseUser, loading: authLoading, authResolved, logOut } = useAuth();
  const { user, isLoading, error: currentUserError, refetch } = useCurrentUser(
    firebaseUser?.displayName || undefined,
    { enabled: authResolved && !!firebaseUser }
  );
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // DO NOTHING until Firebase finishes restoring session
    if (!authResolved) return;

    // Not logged in → protect /launch/*
    if (!firebaseUser && location.startsWith("/launch") && location !== "/launch/login") {
      setLocation("/launch/login");
      return;
    }

    // Logged in → keep them out of login page
    if (firebaseUser && location === "/launch/login") {
      setLocation("/launch");
      return;
    }
  }, [authResolved, firebaseUser, location, setLocation]);

  useEffect(() => {
    if (!authResolved || isLoading || !user || !firebaseUser) return;
    
    if (!user.hasOnboarded && location.startsWith("/launch") && location !== "/launch/onboarding" && location !== "/launch/login") {
      setLocation("/launch/onboarding");
    }
  }, [authResolved, location, setLocation, user, isLoading, firebaseUser]);

  // Show loading spinner while checking auth
  if (!authResolved || authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6d45d2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, show Login page
  if (!firebaseUser && location.startsWith("/launch")) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center">
        <div className="animate-pulse text-white/70">Redirecting to login...</div>
      </div>
    );
  }

  const currentUserStatus = (currentUserError as { status?: number } | null)?.status;

  if (currentUserError) {
    return (
      <div className="min-h-screen w-full bg-[#0c0c1d] flex items-center justify-center">
        <div className="text-center text-white space-y-2 max-w-sm">
          <p className="text-lg font-semibold">We couldn’t load your profile.</p>
          <p className="text-white/70 text-sm">
            {currentUserStatus === 401
              ? "Your session expired. Please sign in again."
              : "Please refresh the page or try again in a moment."}
          </p>
          {currentUserStatus === 401 ? (
            <Button
              onClick={async () => {
                await logOut();
                setLocation("/launch/login");
              }}
              className="mt-2 bg-[#6d45d2] text-white hover:bg-[#5b36b0]"
            >
              Sign in again
            </Button>
          ) : (
            <Button
              onClick={() => refetch()}
              className="mt-2 bg-[#6d45d2] text-white hover:bg-[#5b36b0]"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }


  // User is authenticated, render app routes
  return (
    <ErrorBoundary>
      <Switch>
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
    </ErrorBoundary>
  );
}

function Router() {
  const [location] = useLocation();
  const isAppRoute = location.startsWith("/launch") && location !== "/launch/login";
  if (isAppRoute) {
    return <AppRouter />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/launch/login" component={Login} />
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
      <Route component={NotFound} />
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
