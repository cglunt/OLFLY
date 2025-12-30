import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/useAuth";
import { Mail, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { loading, signInWithGoogle, signInWithEmail, signUpWithEmail, isAuthenticated, error, isConfigured } = useAuth();
  const [, setLocation] = useLocation();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/launch");
    }
  }, [loading, isAuthenticated, setLocation]);

  const handleGoogleSignIn = async () => {
    try {
      setSignInError(null);
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        return;
      }
      setSignInError(err.message || "Failed to sign in");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setSignInError("Please enter your name");
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      let message = err.message || "Authentication failed";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Try signing in instead.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      }
      setSignInError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c1d] flex items-center justify-center">
        <div className="animate-pulse text-white/70">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0c0c1d] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#6d45d2]/20 via-[#0c0c1d] to-[#0c0c1d]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to Olfly</h1>
          <p className="text-white/70">
            Your olfactory training companion
          </p>
        </div>

        <div className="space-y-4">
          {(error || signInError) && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-center">
              <p className="text-red-300 text-sm">{error || signInError}</p>
            </div>
          )}

          {!showEmailForm ? (
            <>
              <Button
                onClick={handleGoogleSignIn}
                disabled={!isConfigured}
                className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-base flex items-center justify-center gap-3 disabled:opacity-50"
                data-testid="button-google-signin"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/50 text-sm">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <Button
                onClick={() => setShowEmailForm(true)}
                disabled={!isConfigured}
                variant="outline"
                className="w-full h-14 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10 font-bold text-base flex items-center justify-center gap-3"
                data-testid="button-email-option"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </Button>
            </>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-14 px-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#ac41c3]"
                    data-testid="input-name"
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 px-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#ac41c3]"
                  data-testid="input-email"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-14 px-4 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#ac41c3]"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white hover:opacity-90 font-bold text-base"
                data-testid="button-email-submit"
              >
                {isSubmitting ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>

              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#ac41c3] hover:underline text-sm"
                  data-testid="button-toggle-signup"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false);
                      setSignInError(null);
                    }}
                    className="text-white/50 hover:text-white text-sm"
                  >
                    Back to all options
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-white/50 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
